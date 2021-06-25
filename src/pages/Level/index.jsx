import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EmptySantri } from "../../assets/images";
import { Input, PrimaryBtn } from "../../components/atomics";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
const Level = () => {
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  const [santris, setSantris] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pagesCount, setPagesCount] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [santriId, setSantriId] = useState("");
  const [santri, setSantri] = useState("");
  const [juz, setJuz] = useState("");
  const [surat, setSurat] = useState("");
  const [ayat, setAyat] = useState("");
  const [time, setTime] = useState("subuh");
  const [showTime, setShowTime] = useState(0);
  const [isAttend, setIsAttend] = useState(1);
  const [achivTitle, setachivTitle] = useState("");
  const [achivEvent, setachivEvent] = useState("");
  const [image, setImage] = useState("");
  const [returning, setReturning] = useState({ kind: "", return_due_date: "" });
  const [returnBlocked, setReturnBlocked] = useState(true);
  const [updatedReturn, setUpdatedReturn] = useState({
    id: "",
    kind: "",
    return_due_date: "",
  });

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const getSantris = async () => {
    try {
      const query = (await searchVal)
        ? `level/santri?username=${searchVal}`
        : "level/santri";
      const { data } = await axios.get(query, config);
      if (!data.errors) {
        setNext(data.next);
        setPrev(data.prev);
        setPagesCount(Math.ceil(data.dataLength / 15));
        setTotalData(data.dataLength);
        return setSantris(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const getSantri = async () => {
    try {
      const { data } = await axios.get(`level/santri/${santriId}`, config);
      if (!data.errors) {
        return setSantri(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const getReturning = async () => {
    try {
      if (santriId) {
        const { data } = await axios.get(
          `level/santri/${santriId}/returning`,
          config
        );
        if (data.status === "OK") {
          return setReturnBlocked(false);
        }
        setReturnBlocked(true);
        setUpdatedReturn({
          id: data.data._id,
          kind: data.data.kind,
          return_due_date: data.data.return_due_date,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearch(!isSearch);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const changeJuz = (e) => {
    setJuz(e.target.value);
  };

  const changeSurat = (e) => {
    setSurat(e.target.value);
  };

  const changeAyat = (e) => {
    setAyat(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e);
    setShowTime(!showTime);
  };

  const handleShowTime = (e) => {
    setShowTime(!showTime);
  };

  const handleIsAttend = (e) => {
    setIsAttend(parseInt(e.target.value));
  };

  const handleAchivTitle = (e) => {
    setachivTitle(e.target.value);
  };

  const handleAchivEvent = (e) => {
    setachivEvent(e.target.value);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleKind = (e) => {
    setReturning({ ...returning, kind: e.target.value });
  };

  const handleReturnDue = (e) => {
    setReturning({ ...returning, return_due_date: e.target.value });
  };

  const insertHafalan = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `level/santri/${santriId}/hafalan`,
        { juz, surat, ayat },
        config
      );
      if (!data.errors) {
        console.log(data.data);
      } else {
        console.log(data.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const insertJamaah = async () => {
    try {
      const { data } = await axios.post(
        `level/santri/${santriId}/jamaah`,
        { kind: time, is_attend: isAttend },
        config
      );
      if (!data.errors) {
        return console.log(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const insertAchievement = async (e) => {
    try {
      e.preventDefault();
      const body = new FormData();
      body.append("title", achivTitle);
      body.append("event", achivEvent);
      body.append("image", image);
      const { data } = await axios.post(
        `level/santri/${santriId}/achievement`,
        body,
        config
      );
      if (!data.errors) {
        return console.log(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const insertReturning = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `level/santri/${santriId}/returning`,
        { kind: returning.kind, return_due_date: returning.return_due_date },
        config
      );
      if (!data.errors) {
        return console.log(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const updateReturning = async (e) => {
    try {
      e.preventDefault();
      console.log(santriId);
      console.log(updatedReturn.id);
      const { data } = await axios.put(
        `level/santri/${santriId}/returning/${updatedReturn.id}`,
        {},
        config
      );
      if (!data.errors) {
        setRefresh(!refresh);
        return console.log(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSantris();
    // eslint-disable-next-line
  }, [refresh, currentPage, isSearch]);

  useEffect(() => {
    getSantri();
    getReturning();
    // eslint-disable-next-line
  }, [refresh, santriId]);

  return (
    <Container>
      <Header title="Overview" desc="See everythings here!" />
      <div className="grid grid-cols-4 grid-rows-1 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-4 flex flex-col">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between"
          >
            <p className="text-md sm:text-2xl font-bold whitespace-nowrap">
              Santri data
            </p>
            <div className="flex">
              <Input
                placeholder="@santri"
                value={searchVal}
                onChange={handleSearchChange}
              />
              <div className="w-4"></div>
              <PrimaryBtn type="submit">Search</PrimaryBtn>
            </div>
          </form>
          <div className="flex-1">
            {santris.length > 0 ? (
              <div className="grid grid-cols-5 grid-rows-3 gap-4 sm:gap-8 my-4 sm:my-8">
                {santris.map((santri) => {
                  return (
                    <SmallCard
                      onClick={() => setSantriId(santri._id)}
                      flow="border-2 cursor-pointer transform hover:scale-105 transition duration-200 ease-in-out"
                      key={santri._id}
                    >
                      <div className="flex">
                        <img
                          src={`http://localhost:4000/${santri.image}`}
                          alt="santriimage"
                          className="rounded-lg h-24 w-20 object-cover mr-2"
                        />
                        <div className="min-w-0">
                          <p className="text-lg whitespace-nowrap overflow-hidden overflow-ellipsis truncate">
                            {santri.name}
                          </p>
                          <p className="font-bold text-gray-500">{`@${santri.username}`}</p>
                        </div>
                      </div>
                    </SmallCard>
                  );
                })}
              </div>
            ) : (
              <div className="w-100 flex flex-col justify-center items-center">
                <EmptySantri />
                <p>No santri found, try to create one!</p>
              </div>
            )}
          </div>
          {santris.length > 0 ? (
            <>
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
            </>
          ) : (
            ""
          )}
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">Hafalan</p>
          <p className="mb-8">{santri ? santri.name : ""}</p>
          {santriId ? (
            <form onSubmit={insertHafalan} className="flex-1 flex flex-col">
              <div>
                <label htmlFor="juz">Juz</label>
                <br />
                <Input placeholder="Juz" value={juz} onChange={changeJuz} />
              </div>
              <br />
              <div>
                <label htmlFor="surat">Surat</label>
                <br />
                <Input
                  placeholder="Surat"
                  value={surat}
                  onChange={changeSurat}
                />
              </div>
              <br />
              <div className="flex-1">
                <label htmlFor="ayat">Ayat</label>
                <br />
                <Input placeholder="Ayat" value={ayat} onChange={changeAyat} />
              </div>
              <br />
              <div>
                <PrimaryBtn type="submit">Add Hafalan</PrimaryBtn>
              </div>
            </form>
          ) : (
            <div className="h-64 flex justify-center items-center">
              <p className="text-center">
                Select one santri to use this features
              </p>
            </div>
          )}
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">Jamaah</p>
          <p className="mb-8">{santri ? santri.name : ""}</p>
          {santriId ? (
            <div className="flex-1 flex flex-col">
              <p>Attendance</p>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="is_attend"
                  value={1}
                  onChange={handleIsAttend}
                  checked={isAttend}
                />
                <p className="ml-1">Attend</p>
              </div>
              <div className="flex items-center my-2">
                <input
                  type="radio"
                  name="is_attend"
                  value={0}
                  onChange={handleIsAttend}
                  checked={!isAttend}
                />
                <p className="ml-1">Not Attend</p>
              </div>
              <br />
              <p>Time</p>
              <div className="flex-1">
                <button
                  onClick={handleShowTime}
                  className="font-medium py-1 px-4 rounded-md border-2 focus:border-blue-500 outline-none focus:outline-none inline-flex items-center"
                >
                  {time}
                  <span className="pl-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`${
                    showTime ? "visible" : "invisible"
                  } flex flex-col rounded-md border-2 w-min px-1 my-2`}
                >
                  <button
                    onClick={() => handleTimeChange("subuh")}
                    className="font-medium py-1 px-4 rounded-md my-1 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    Subuh
                  </button>
                  <button
                    onClick={() => handleTimeChange("duhur")}
                    className="font-medium py-1 px-4 rounded-md my-1 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    Duhur
                  </button>
                  <button
                    onClick={() => handleTimeChange("asar")}
                    className="font-medium py-1 px-4 rounded-md my-1 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    Asar
                  </button>
                  <button
                    onClick={() => handleTimeChange("maghrib")}
                    className="font-medium py-1 px-4 rounded-md my-1 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    Maghrib
                  </button>
                  <button
                    onClick={() => handleTimeChange("isya")}
                    className="font-medium py-1 px-4 rounded-md my-1 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    Isya
                  </button>
                </div>
              </div>
              <div>
                <PrimaryBtn onClick={insertJamaah}>Add Jamaah</PrimaryBtn>
              </div>
            </div>
          ) : (
            <div className="h-64 flex justify-center items-center">
              <p className="text-center">
                Select one santri to use this features
              </p>
            </div>
          )}
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">Achievement</p>
          <p className="mb-8">{santri ? santri.name : ""}</p>
          {santriId ? (
            <form className="flex-1 flex flex-col" onSubmit={insertAchievement}>
              <div className="flex-1">
                <div>
                  <label htmlFor="title">Title</label>
                  <br />
                  <Input
                    placeholder="Title"
                    value={achivTitle}
                    onChange={handleAchivTitle}
                  />
                </div>
                <br />
                <div>
                  <label htmlFor="event">Event name</label>
                  <br />
                  <Input
                    placeholder="Event name"
                    value={achivEvent}
                    onChange={handleAchivEvent}
                  />
                </div>
                <br />
                <div>
                  <label htmlFor="image">Image</label>
                  <br />
                  <input
                    type="file"
                    onChange={handleImage}
                    className="font-medium"
                  />
                </div>
                <br />
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="imageachiv"
                    className="h-48 w-36 object-cover rounded-xl my-2"
                  />
                ) : (
                  ""
                )}
              </div>
              <br />
              <div>
                <PrimaryBtn type="submit">Add Achievement</PrimaryBtn>
              </div>
            </form>
          ) : (
            <div className="h-64 flex justify-center items-center">
              <p className="text-center">
                Select one santri to use this features
              </p>
            </div>
          )}
        </Card>
        {returnBlocked ? (
          <Card flow="flex flex-col">
            <p className="text-md sm:text-2xl font-bold">Returning</p>
            <p className="mb-8">{santri ? santri.name : ""}</p>
            {santriId ? (
              <form className="flex-1 flex flex-col" onSubmit={updateReturning}>
                <div className="flex-1">
                  <div>
                    <label htmlFor="kind">Kind</label>
                    <br />
                    <Input
                      disabled
                      placeholder="pulang or izin"
                      value={updatedReturn.kind}
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="return_due_date">Return Due Date</label>
                    <br />
                    <Input
                      disabled
                      type="date"
                      value={updatedReturn.return_due_date}
                    />
                  </div>
                </div>
                <div>
                  <PrimaryBtn type="submit">Mark as return</PrimaryBtn>
                </div>
              </form>
            ) : (
              <div className="h-64 flex justify-center items-center">
                <p className="text-center">
                  Select one santri to use this features
                </p>
              </div>
            )}
          </Card>
        ) : (
          <Card flow="flex flex-col">
            <p className="text-md sm:text-2xl font-bold">Returning</p>
            <p className="mb-8">{santri ? santri.name : ""}</p>
            {santriId ? (
              <form className="flex-1 flex flex-col" onSubmit={insertReturning}>
                <div className="flex-1">
                  <div>
                    <label htmlFor="kind">Kind</label>
                    <br />
                    <Input
                      placeholder="pulang or izin"
                      value={returning.kind}
                      onChange={handleKind}
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="return_due_date">Return Due Date</label>
                    <br />
                    <Input
                      type="date"
                      value={returning.return_due_date}
                      onChange={handleReturnDue}
                    />
                  </div>
                </div>
                <div>
                  <PrimaryBtn type="submit">Add Returning</PrimaryBtn>
                </div>
              </form>
            ) : (
              <div className="h-64 flex justify-center items-center">
                <p className="text-center">
                  Select one santri to use this features
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </Container>
  );
};

export default Level;
