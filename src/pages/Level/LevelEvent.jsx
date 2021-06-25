import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Input, PrimaryBtn } from "../../components/atomics";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

const LevelEvent = () => {
  const [totalData, setTotalData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [discoverCurrentPage, setDiscoverCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [myposts, setMyposts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [rediscover, setRediscover] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "",
    desc: "",
  });

  let body = new FormData();

  const onOpenModal = (e) => {
    setImages(e);
    setOpen(true);
  };

  const onCloseModal = () => setOpen(false);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const getMyPosts = async () => {
    try {
      const { data } = await axios.get(
        `level/event/me?currentPage=${currentPage}`,
        config
      );
      if (!data.errors) {
        setNext(data.next);
        setPrev(data.prev);
        setPagesCount(Math.ceil(data.dataLength / 8));
        setTotalData(data.dataLength);
        return setMyposts(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `level/event?currentPage=${discoverCurrentPage}`,
        config
      );
      if (!data.errors) {
        setRediscover(data.next);
        if (discoverCurrentPage > 1) {
          return setPosts(...posts, ...data.data);
        }
        return setPosts(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const discoverMore = () => {
    setDiscoverCurrentPage(discoverCurrentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleNewEventTitle = (e) => {
    setNewEvent({ ...newEvent, title: e.target.value });
  };

  const handleNewEventCategory = (e) => {
    setNewEvent({ ...newEvent, category: e.target.value });
  };

  const handleNewEventDesc = (e) => {
    setNewEvent({ ...newEvent, desc: e.target.value });
  };

  const handleImages = (e) => {
    const files = e.target.files;
    body = new FormData();
    for (let i = 0; i < files.length; i++) {
      body.append("images", files[i]);
    }
  };

  const insertEvent = async (e) => {
    try {
      e.preventDefault();
      body.append("title", newEvent.title);
      body.append("category", newEvent.category);
      body.append("desc", newEvent.desc);
      const { data } = await axios.post("level/event", body, config);
      if (!data.errors) {
        return setRefresh(!refresh);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyPosts();
    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, [refresh, discoverCurrentPage]);
  return (
    <Container>
      <Header title="Event" desc="Post every events happen in ponpes!" />
      <div className="grid grid-cols-3 grid-rows-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-2">
          <p className="text-md sm:text-2xl font-bold">Your Post</p>
          <p className="mb-8">All post you've posted here!</p>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            classNames={{
              modal: "rounded-2xl w-100 max-w-screen p-0 m-0",
            }}
          >
            <Carousel plugins={["arrows", "infinite"]}>
              {images.map((image, index) => {
                return (
                  <img
                    key={index}
                    src={`http://localhost:4000/${image}`}
                    alt="sgs"
                    className="w-auto max-h-96"
                  />
                );
              })}
            </Carousel>
          </Modal>
          {myposts.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-4 sm:gap-8 my-4 sm:my-8">
              {myposts.map((post) => {
                return (
                  <SmallCard
                    nopadding
                    key={post._id}
                    flow="cursor-pointer"
                    onClick={() => onOpenModal(post.images)}
                  >
                    <img
                      className="w-full h-48 rounded-xl object-cover"
                      src={`http://localhost:4000/${post.images[0]}`}
                      alt="postimage"
                    />
                    <p className="mt-2">{post.title}</p>
                    <p>{post.date.split("T")[0]}</p>
                  </SmallCard>
                );
              })}
            </div>
          ) : (
            ""
          )}
          <div className="py-2">
            <p className="text-center">{`${totalData} data`}</p>
            <p className="text-center">{`Showing page ${currentPage} of ${pagesCount}`}</p>
          </div>
          <div className="flex justify-center items-center">
            <PrimaryBtn equal disabled={!prev} onClick={handlePrevPage}>
              Previous
            </PrimaryBtn>
            <div className="mx-2"></div>
            <PrimaryBtn equal disabled={!next} onClick={handleNextPage}>
              Next
            </PrimaryBtn>
          </div>
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">New Event</p>
          <p className="mb-8">Let's create new one!</p>
          <form className="flex-1 flex flex-col" onSubmit={insertEvent}>
            <div className="flex-1">
              <div>
                <label htmlFor="title">Title</label>
                <br />
                <Input
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={handleNewEventTitle}
                />
              </div>
              <br />
              <div>
                <label htmlFor="category">Category</label>
                <br />
                <Input
                  placeholder="official or lomba"
                  value={newEvent.category}
                  onChange={handleNewEventCategory}
                />
              </div>
              <br />
              <div>
                <label htmlFor="desc">Description</label>
                <br />
                <Input
                  placeholder="Description"
                  value={newEvent.desc}
                  onChange={handleNewEventDesc}
                />
              </div>
              <br />
              <div>
                <Input type="file" multiple onChange={handleImages} />
              </div>
            </div>
            <div>
              <PrimaryBtn type="submit">Add Event!</PrimaryBtn>
            </div>
          </form>
        </Card>
        <Card flow="col-span-3">
          <p className="text-md sm:text-2xl font-bold">Discover</p>
          <p className="mb-8">All post</p>
          {posts.length > 0 ? (
            <div className="m-auto max-w-4xl grid grid-cols-3 gap-4 sm:gap-8 my-4 sm:my-8">
              {posts.map((post) => {
                return (
                  <SmallCard
                    nopadding
                    key={post._id}
                    flow="cursor-pointer"
                    onClick={() => onOpenModal(post.images)}
                  >
                    <img
                      className="w-full h-48 rounded-xl object-cover"
                      src={`http://localhost:4000/${post.images[0]}`}
                      alt="postimage"
                    />
                  </SmallCard>
                );
              })}
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-center">
            <PrimaryBtn disabled={!rediscover} onClick={discoverMore}>
              Load More
            </PrimaryBtn>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default LevelEvent;
