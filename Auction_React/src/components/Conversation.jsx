import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import "../pages/css/Conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const userId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      if (isMounted)
        try {
          const res = await axios.get(
            "http://localhost:5000/user/find/" + userId
          );
          setUser(res.data);
        } catch (err) {
          console.log(err);
        }
    };
    getUser();
    return () => {
      isMounted = false;
    };
  }, [currentUser, conversation]);

  return (
    user && (
      <>
        <div className="conversation">
          <img
            className="conversationImg"
            src={
              user.img != null
                ? `uploads/${user.img}`
                : "https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg"
            }
            alt=""
          />
          <span className="conversationName">{user.username}</span>
        </div>
      </>
    )
  );
}
