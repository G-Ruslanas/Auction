import React from "react";
import { auctions } from "../data";
import { useParams } from "react-router-dom";

const Auction = () => {
  const { id } = useParams();
  const auction = auctions.find((auc) => auc.id.toString() === id);

  return (
    <div className="auction">
      <img src={auction.img} alt="" className="auctionImg" />
      <h1 className="auctionTitle">{auction.title}</h1>
      <p className="auctionDesc">{auction.desc}</p>
    </div>
  );
};

export default Auction;
