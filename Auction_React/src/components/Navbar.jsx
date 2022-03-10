import React from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

var socket = io.connect("http://localhost:5000", connectionOptions);

const Navbar = ({ user }) => {
  const logout = () => {
    socket.emit("disconnectUser", { username: user.username }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    window.open("http://localhost:5000/auth/logout", "_self");
  };
  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          Auction House
        </Link>
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
              src={
                "https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg" ||
                user.photos[0].value
              }
              alt="avatar"
              className="avatar"
            />
          </li>
          <li className="listItem">{user.username || user.displayName}</li>
          <li className="listItem" onClick={logout}>
            Logout
          </li>
        </ul>
      ) : (
        <div className="links">
          <Link className="link" to="/login">
            Login
          </Link>
          <Link className="link" to="/register">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
