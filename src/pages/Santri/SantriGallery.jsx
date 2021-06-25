import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { PrimaryBtn } from "../../components/atomics";

const SantriGallery = () => {
  const { user } = useContext(UserContext);
  const [achievements, setAchievements] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [discoverCurrentPage, setDiscoverCurrentPage] = useState(1);
  const [rediscover, setRediscover] = useState(false);
  const [fromAch, setFromAch] = useState(true);

  const onOpenModalAch = (e) => {
    setImage(e);
    setFromAch(true);
    setOpen(true);
  };

  const onOpenModal = (e) => {
    setImages(e);
    setFromAch(false);
    setOpen(true);
  };

  const onCloseModal = () => setOpen(false);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `santri/event?currentPage=${discoverCurrentPage}`,
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

  const getMyAchievements = async () => {
    try {
      const { data } = await axios.get("santri/achievement", config);
      if (!data.errors) {
        return setAchievements(data.data.progress.achievement);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyAchievements();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, [discoverCurrentPage]);

  return (
    <Container>
      <Header title="Gallery" desc="Explore our documentations" />
      <div className="grid gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card>
          <p className="text-md sm:text-2xl font-bold">Your Achievement</p>
          <p className="mb-8">See all of your achievement, yeay!</p>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            classNames={{
              modal: "rounded-2xl w-100 max-w-screen p-0 m-0",
            }}
          >
            {fromAch ? (
              <img
                src={`http://localhost:4000/${image}`}
                className="w-full h-full rounded-xl object-cover"
                alt="imageofthis"
              />
            ) : (
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
            )}
          </Modal>
          <div className="grid grid-cols-4 grid-rows-2 gap-4 sm:gap-8 my-4 sm:my-8">
            {achievements.length > 0
              ? achievements.map((ach) => {
                  return (
                    <SmallCard
                      nopadding
                      key={ach._id}
                      flow="cursor-pointer"
                      onClick={() => onOpenModalAch(ach.image)}
                    >
                      <img
                        className="w-full h-48 rounded-xl object-cover"
                        src={`http://localhost:4000/${ach.image}`}
                        alt="postimage"
                      />
                      <p className="mt-2">{ach.title}</p>
                      <p>{ach.event}</p>
                    </SmallCard>
                  );
                })
              : ""}
          </div>
        </Card>
        <Card>
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
            <p className="text-center text-4xl font-bold py-36">No Posts Yet</p>
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

export default SantriGallery;
