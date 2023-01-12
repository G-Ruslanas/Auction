import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "../pages/css/UsersOnline.css";

const UsersOnline = ({ usersOnline, currentId, setCurrentChat }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setOnlineUsers([]);
        if (usersOnline) {
          usersOnline.map(async (userOnline) => {
            const res = await axios.get(
              "http://localhost:5000/user/find/" + userOnline.userId
            );
            setOnlineUsers((prev) => [...prev, res.data]);
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [usersOnline]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/conversation/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="chatOnline">
        {onlineUsers?.map((onlineUser, index) => (
          <div
            className="chatOnlineUsers"
            onClick={() => handleClick(onlineUser)}
            key={index}
          >
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  onlineUser.img != null
                    ? `uploads/${onlineUser.img}`
                    : "https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg"
                }
                alt=""
              />

              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{onlineUser.username}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default UsersOnline;
