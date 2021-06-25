import { useContext, useEffect, useState } from "react";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { Input, PrimaryBtn } from "../../components/atomics";
import { EmptySantri } from "../../assets/images";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
const AdminSantri = () => {
  const [searchVal, setSearchVal] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [santris, setSantris] = useState([]);
  const [reload, setReload] = useState(false);
  const { user } = useContext(UserContext);
  const [santriId, setSantriId] = useState("");
  const [santri, setSantri] = useState(null);
  const [createError, setCreateError] = useState(false);
  const [createErrorMsg, setCreateErrorMsg] = useState(null);
  const [updateError, setUpdateError] = useState(false);
  const [updateErrorMsg, setUpdateErrorMsg] = useState(null);
  const [santriForm, setSantriForm] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    birth_date: "",
    birth_place: "",
    gender: 0,
    address: "",
    phone_number: "",
    parent_name: "",
    parent_phone_number: "",
    level: "",
  });
  const [updateSantriForm, setUpdateSantriForm] = useState({
    password: "",
    name: "",
    birth_date: "",
    birth_place: "",
    gender: 0,
    address: "",
    phone_number: "",
    parent_name: "",
    parent_phone_number: "",
  });
  const [image, setImage] = useState("");
  const [updateImage, setUpdateImage] = useState("");

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
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

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const createNewSantri = async (e) => {
    try {
      setCreateError(false);
      e.preventDefault();
      const body = new FormData();
      for (let key in santriForm) {
        body.append([key], santriForm[key]);
      }
      if (image) {
        body.append("image", image);
      }
      const { data } = await axios.post("admin/santri", body, config);
      if (!data.errors) {
        return setReload(!reload);
      }
      setCreateErrorMsg(data.errors);
      setCreateError(true);
    } catch (err) {
      console.log(err);
    }
  };

  const updateNewSantri = async (e) => {
    try {
      setUpdateError(false);
      e.preventDefault();
      const body = new FormData();
      for (let key in updateSantriForm) {
        if (updateSantriForm[key] !== "") {
          body.append([key], updateSantriForm[key]);
        }
      }
      if (updateImage) {
        body.append("image", updateImage);
      }
      const { data } = await axios.put(
        `admin/santri/${santriId}`,
        body,
        config
      );
      if (!data.errors) {
        return setReload(!reload);
      }
      setUpdateErrorMsg(data.errors);
      setUpdateError(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getSantris = async () => {
    try {
      const query = (await searchVal)
        ? `admin/santri?username=${searchVal}`
        : "admin/santri";
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

  const getSantri = async (id) => {
    try {
      if (santriId && santriId !== "") {
        const { data } = await axios.get(`admin/santri/${santriId}`, config);
        if (!data.errors) {
          return setSantri(data.data);
        }
        console.log(data.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setUsername = (e) => {
    setSantriForm({ ...santriForm, username: e.target.value });
  };

  const setPassword = (e) => {
    setSantriForm({ ...santriForm, password: e.target.value });
  };

  const setEmail = (e) => {
    setSantriForm({ ...santriForm, email: e.target.value });
  };

  const setName = (e) => {
    setSantriForm({ ...santriForm, name: e.target.value });
  };

  const setBirthDate = (e) => {
    setSantriForm({ ...santriForm, birth_date: e.target.value });
  };

  const setBirthPlace = (e) => {
    setSantriForm({ ...santriForm, birth_place: e.target.value });
  };

  const setGender = (e) => {
    setSantriForm({ ...santriForm, gender: parseInt(e.target.value) });
  };

  const setAddress = (e) => {
    setSantriForm({ ...santriForm, address: e.target.value });
  };

  const setPhoneNumber = (e) => {
    setSantriForm({ ...santriForm, phone_number: e.target.value });
  };

  const setParentName = (e) => {
    setSantriForm({ ...santriForm, parent_name: e.target.value });
  };

  const setParentPhoneNumber = (e) => {
    setSantriForm({ ...santriForm, parent_phone_number: e.target.value });
  };

  const setLevel = (e) => {
    setSantriForm({ ...santriForm, level: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const setUpdatePassword = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, password: e.target.value });
  };

  const setUpdateName = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, name: e.target.value });
  };

  const setUpdateBirthDate = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, birth_date: e.target.value });
  };

  const setUpdateBirthPlace = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, birth_place: e.target.value });
  };

  const setUpdateGender = (e) => {
    setUpdateSantriForm({
      ...updateSantriForm,
      gender: parseInt(e.target.value),
    });
  };

  const setUpdateAddress = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, address: e.target.value });
  };

  const setUpdatePhoneNumber = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, phone_number: e.target.value });
  };

  const setUpdateParentName = (e) => {
    setUpdateSantriForm({ ...updateSantriForm, parent_name: e.target.value });
  };

  const setUpdateParentPhoneNumber = (e) => {
    setUpdateSantriForm({
      ...updateSantriForm,
      parent_phone_number: e.target.value,
    });
  };

  const handleUpdateImage = (e) => {
    setUpdateImage(e.target.files[0]);
  };

  useEffect(() => {
    getSantris();
    // eslint-disable-next-line
  }, [reload, isSearch]);

  useEffect(() => {
    getSantri();
    // eslint-disable-next-line
  }, [santriId]);
  return (
    <Container>
      <Header title="Santri" desc="Manage all of your santri" />
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
                          <p className="font-bold text-gray-500">{`Level ${santri.level}`}</p>
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
        <Card flow="col-span-2">
          <p className="text-md sm:text-2xl font-bold">New Santri</p>
          <p className="mb-8">Let's create new santri</p>
          <form onSubmit={createNewSantri} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="username">Username</label>
              <br />
              <Input
                placeholder="Username"
                value={santriForm.username}
                onChange={setUsername}
              />
            </div>
            <div>
              <label htmlFor="Password">Password</label>
              <br />
              <Input
                placeholder="password"
                value={santriForm.password}
                onChange={setPassword}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <br />
              <Input
                placeholder="Email"
                value={santriForm.email}
                onChange={setEmail}
              />
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <br />
              <Input
                placeholder="Name"
                value={santriForm.name}
                onChange={setName}
              />
            </div>
            <div>
              <label htmlFor="birth_date">Birth Date</label>
              <br />
              <Input
                type="date"
                value={santriForm.birth_date}
                onChange={setBirthDate}
              />
            </div>
            <div>
              <label htmlFor="birth_place">Birth Place</label>
              <br />
              <Input
                placeholder="Birth Place"
                value={santriForm.birth_place}
                onChange={setBirthPlace}
              />
            </div>
            <div>
              <label htmlFor="gender">Gender</label>
              <br />
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  name="gender"
                  value={1}
                  onChange={setGender}
                  checked={santriForm.gender}
                />
                <p className="ml-1 mr-2">Female</p>
                <input
                  type="radio"
                  name="gender"
                  value={0}
                  onChange={setGender}
                  checked={!santriForm.gender}
                />
                <p className="ml-1">Male</p>
              </div>
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <br />
              <Input
                placeholder="Address"
                value={santriForm.address}
                onChange={setAddress}
              />
            </div>
            <div>
              <label htmlFor="phone_number">Phone Number</label>
              <br />
              <Input
                placeholder="08XXXXXXXXXX"
                value={santriForm.phone_number}
                onChange={setPhoneNumber}
              />
            </div>
            <div>
              <label htmlFor="parent_name">Parent Name</label>
              <br />
              <Input
                placeholder="Parent Name"
                value={santriForm.parent_name}
                onChange={setParentName}
              />
            </div>
            <div>
              <label htmlFor="parent_phone_number">Parent Phone Number</label>
              <br />
              <Input
                placeholder="08XXXXXXXXXX"
                value={santriForm.parent_phone_number}
                onChange={setParentPhoneNumber}
              />
            </div>
            <div>
              <label htmlFor="level">Level</label>
              <br />
              <Input
                placeholder="Level"
                value={santriForm.level}
                onChange={setLevel}
              />
            </div>
            <div className="col-span-2">
              {image ? (
                <img
                  className="h-48 w-48 rounded-lg object-cover"
                  src={URL.createObjectURL(image)}
                  alt="santriimage"
                />
              ) : (
                ""
              )}
              <br />
              <label htmlFor="image">Image</label>
              <br />
              <input
                className="font-medium"
                type="file"
                onChange={handleImage}
              />
            </div>
            <div>
              <PrimaryBtn type="submit">Create Santri</PrimaryBtn>
            </div>
            <div>
              <p className="text-red-600">
                {createError ? createErrorMsg : ""}
              </p>
            </div>
          </form>
        </Card>
        <Card flow="col-span-2 flex flex-col">
          <p className="text-md sm:text-2xl font-bold">View Santri</p>
          <p className="mb-8">See Santri</p>
          {santri ? (
            <form onSubmit={updateNewSantri} className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username">Username</label>
                <br />
                <Input disabled value={santri.username} />
              </div>
              <div>
                <label htmlFor="Password">Password</label>
                <br />
                <Input
                  placeholder="password"
                  value={updateSantriForm.password}
                  onChange={setUpdatePassword}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <br />
                <Input disabled value={santri.email} />
              </div>
              <div>
                <label htmlFor="name">Name</label>
                <br />
                <Input
                  placeholder="Name"
                  value={updateSantriForm.name}
                  onChange={setUpdateName}
                />
              </div>
              <div>
                <label htmlFor="birth_date">Birth Date</label>
                <br />
                <Input
                  type="date"
                  value={updateSantriForm.birth_date}
                  onChange={setUpdateBirthDate}
                />
              </div>
              <div>
                <label htmlFor="birth_place">Birth Place</label>
                <br />
                <Input
                  placeholder="Birth Place"
                  value={updateSantriForm.birth_place}
                  onChange={setUpdateBirthPlace}
                />
              </div>
              <div>
                <label htmlFor="gender">Gender</label>
                <br />
                <div className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="gender"
                    value={1}
                    onChange={setUpdateGender}
                    checked={updateSantriForm.gender}
                  />
                  <p className="ml-1 mr-2">Female</p>
                  <input
                    type="radio"
                    name="gender"
                    value={0}
                    onChange={setUpdateGender}
                    checked={!updateSantriForm.gender}
                  />
                  <p className="ml-1">Male</p>
                </div>
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <br />
                <Input
                  placeholder="Address"
                  value={updateSantriForm.address}
                  onChange={setUpdateAddress}
                />
              </div>
              <div>
                <label htmlFor="phone_number">Phone Number</label>
                <br />
                <Input
                  placeholder="08XXXXXXXXXX"
                  value={updateSantriForm.phone_number}
                  onChange={setUpdatePhoneNumber}
                />
              </div>
              <div>
                <label htmlFor="parent_name">Parent Name</label>
                <br />
                <Input
                  placeholder="Parent Name"
                  value={updateSantriForm.parent_name}
                  onChange={setUpdateParentName}
                />
              </div>
              <div>
                <label htmlFor="parent_phone_number">Parent Phone Number</label>
                <br />
                <Input
                  placeholder="08XXXXXXXXXX"
                  value={updateSantriForm.parent_phone_number}
                  onChange={setUpdateParentPhoneNumber}
                />
              </div>
              <div>
                <label htmlFor="level">Level</label>
                <br />
                <Input disabled value={santri.level} />
              </div>
              <div className="col-span-2">
                {updateImage ? (
                  <img
                    className="h-48 w-48 rounded-lg object-cover"
                    src={URL.createObjectURL(updateImage)}
                    alt="santriimage"
                  />
                ) : (
                  ""
                )}
                <br />
                <label htmlFor="image">Image</label>
                <br />
                <input
                  className="font-medium"
                  type="file"
                  onChange={handleUpdateImage}
                />
              </div>
              <div>
                <PrimaryBtn type="submit">Update Santri</PrimaryBtn>
              </div>
              <div>
                <p className="text-red-600">
                  {updateError ? updateErrorMsg : ""}
                </p>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p>Select one santri to view</p>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default AdminSantri;
