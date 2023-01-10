import React from "react";
import { format } from "timeago.js";
import "../pages/css/Message.css";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBot">{format(message.createdAt)}</div>
    </div>
  );
}
