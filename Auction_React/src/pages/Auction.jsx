import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Time from "../components/Time";

const Auction = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState({});
  useEffect(() => {
    const getAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auction/find/${id}`);
        setAuction(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuction();
  }, [id]);

  return (
    <div className="auction">
      <div className="leftDiv">
        <img src={`../uploads/${auction.img}`} alt="" className="auctionImg" />
      </div>
      <div className="rightDiv">
        <div className="auctionInfo">
          <h1 className="auctionTitle">Auction Title: {auction.title}</h1>
          <p className="auctionCat">Auction Category: {auction.category}</p>
          <p className="auctionDesc">Auction Description: {auction.desc}</p>
          <p className="auctionStart">
            Auction start date and time:{" "}
            {auction.start_date + " " + auction.start_time}
          </p>
          <p className="auctionEnd">
            Auction end date and time:{" "}
            {auction.end_date + " " + auction.end_time}
          </p>
          <p className="auctionBid">Auction start bid: ${auction.bid_start}</p>
          <p className="auctionPrice">
            Auction purchase price: ${auction.purchase_price}
          </p>
          <span className="auctionTime">Auction status: </span>
          {Object.keys(auction).length !== 0 && (
            <Time
              startDate={auction.start_date}
              startTime={auction.start_time}
              endDate={auction.end_date}
              endTime={auction.end_time}
              auction={auction}
            />
          )}

          <p className="auctionCurrentPrice">
            Current auction price: $6 ## bidder: Someone{" "}
          </p>
          <div className="buttons">
            <input
              type="number"
              defaultValue={auction.bid_start}
              placeholder="bid"
              className="bidInput"
            />
            <button className="bidButton">Bid</button>
            <button className="purchaseButton">Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
