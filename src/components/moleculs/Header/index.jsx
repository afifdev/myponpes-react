import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";

const Header = ({ title, desc }) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const getMySelf = async () => {
    try {
      if (user.level === 1 || user.level === 0) {
        const { data } = await axios.get("/santri/myself", config);
        if (!data.errors) {
          setName(data.data.name);
          setImage(data.data.image);
        } else {
          console.log(data.errors);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMySelf();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg sm:text-3xl font-bold">{title}</p>
        </div>
        <div className="flex items-center">
          <p>Hello, {user.level === 2 ? "Gus Dahlan" : name}</p>
          <img
            src={
              user.level === 2
                ? "https://placekitten.com/200/300"
                : image
                ? `http://localhost:4000/${image}`
                : ""
            }
            alt="gambar"
            className="h-8 w-8 object-cover rounded-full ml-4"
          />
        </div>
      </div>
      <p className="mb-4">{desc}</p>
    </>
  );
};

export default Header;
