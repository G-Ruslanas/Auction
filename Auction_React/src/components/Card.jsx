import React from "react";
import { Link } from "react-router-dom";

const Card = ({ auction }) => {
  return (
    <div className="card">
      <span className="title">{auction.title}</span>
      <img src={`uploads/${auction.img}`} alt="" className="img" />
      <p className="desc">{auction.category}</p>
      <Link className="link" to={`/auction/${auction._id}`}>
        <button className="cardButton">Read More</button>
      </Link>
    </div>
  );
};

export default Card;
