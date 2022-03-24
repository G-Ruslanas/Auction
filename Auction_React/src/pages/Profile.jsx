import React, { useState } from "react";
import EditUser from "../components/EditUser";

const Profile = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="profile">
      <div className="leftProfile">
        <img
          src={
            user.img
              ? `uploads/${user.img}`
              : "https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg"
          }
          alt=""
          className="profileImage"
        />
      </div>
      <div className="rightProfile">
        <label htmlFor="">Username</label>
        <h1>{user.username}</h1>
        <label htmlFor="">Email</label>
        <h1>{user.email}</h1>
        <label htmlFor="">Role</label>
        <h1>{user.role !== "" ? user.role : "Regular User"}</h1>
        <button className="btn" onClick={() => setModalShow(true)}>
          Edit Profile
        </button>
        <EditUser
          show={modalShow}
          onHide={() => setModalShow(false)}
          user={user}
        ></EditUser>
      </div>
    </div>
  );
};

export default Profile;
