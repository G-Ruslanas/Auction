import React from "react";
import { Link } from "react-router-dom";

const Card = ({ auction }) => {
  return (
    <div className="card">
      <Link className="link" to={`/auction/${auction.id}`}>
        <span className="title">{auction.title}</span>
        <img src={auction.img} alt="" className="img" />
        <p className="desc">{auction.desc}</p>
        <button className="cardButton">Read More</button>
      </Link>
    </div>
  );
};

export default Card;
