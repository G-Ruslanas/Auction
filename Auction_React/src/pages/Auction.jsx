import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Time from "../components/Time";
import { Alert } from "react-bootstrap";
import AutomaticBid from "../components/AutomaticBid";
import "./css/Auction.css";

const Auction = ({ user, socket }) => {
  const { id } = useParams();
  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState(0);
  const [resBid, setResBid] = useState(0);
  const [resName, setResName] = useState("");
  const [status, setStatus] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(false);
  const [winnerStatus, setWinnerStatus] = useState(false);
  const [error, setError] = useState([]);
  const [resError, setResError] = useState("");
  const [resPurchaseStatus, setResPurchaseStatus] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const getAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auction/find/${id}`);
        setAuction(res.data);
        socket.emit("join-room", { room: id });
      } catch (error) {
        console.log(error);
      }
    };
    getAuction();
  }, [id]);

  const handleClick = async () => {
    const errors = [];
    if (bid < auction.bid_start) {
      errors.push("Bid should be higher than bid start of this auction");
    }
    try {
      const prevBid = await axios.get(`http://localhost:5000/bid/find/${id}`);
      if (prevBid.data.bid >= bid) {
        errors.push("Bid should be higher than previous bid on this auction");
      }
    } catch (err) {
      console.log(err);
    }
    setError(errors);

    if (errors.length === 0) {
      const data = {
        user_id: user._id,
        auction_id: auction._id,
        bid: bid,
      };
      try {
        const res = await axios.put("http://localhost:5000/bid/update", data);
        if (res.data.errors) {
          setResError(res.data.errors);
        } else {
          setResError("");
        }
        socket.emit("bid", {
          bid: res.data.bid,
          name: user.username,
          purchase: false,
          room: res.data.auction_id,
        });
        socket.on("message", (res, name, purchase, room) => {
          if (room === id) {
            setResBid(res);
            setResName(name);
            setResPurchaseStatus(purchase);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const getDbBid = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/bid/find/${id}`);
        if (res.data) {
          const findUser = await axios.get(
            `http://localhost:5000/user/find/${res.data.user_id}`
          );
          setResBid(res.data.bid);
          socket.emit("bid", {
            bid: res.data.bid,
            name: findUser.data.username,
            purchase: false,
            room: res.data.auction_id,
          });
          socket.on("message", (res, name, purchase, room) => {
            if (room !== id) return;
            setResBid(res);
            setResName(name);
            setResPurchaseStatus(purchase);
          });
        } else {
          socket.emit("bid", {
            bid: 0,
            name: "Unknown",
            purchase: false,
            room: auction._id,
          });
          socket.on("message", (res, name, purchase, room) => {
            if (room !== id) return;
            setResBid(res);
            setResName(name);
            setResPurchaseStatus(purchase);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDbBid();
  }, [id, auction._id]);

  useEffect(() => {
    const postWinner = async () => {
      if (
        resBid >= auction.bid_start &&
        !status &&
        !purchaseStatus &&
        winnerStatus
      ) {
        const data = {
          user_id: user._id,
          auction_id: auction._id,
          price: resBid,
        };
        try {
          await axios.put("http://localhost:5000/winner", data);
        } catch (error) {
          console.log(error);
        }
      } else if (!status && !purchaseStatus && winnerStatus) {
        const data = {
          auction_id: auction._id,
        };
        try {
          await axios.put("http://localhost:5000/auction/nowinner", data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    postWinner();
  }, [
    status,
    user,
    auction._id,
    auction.bid_start,
    resBid,
    purchaseStatus,
    winnerStatus,
  ]);

  const handleAutomaticBid = async () => {
    setModalShow(true);
    const data = {
      user_id: user._id,
      auction_id: auction._id,
      automatic_bid: bid,
    };
  };

  const handlePurchase = async () => {
    setPurchaseStatus(true);
    const data = {
      user_id: user._id,
      auction_id: auction._id,
      price: auction.purchase_price,
    };
    try {
      await axios.put("http://localhost:5000/winner", data);
      socket.emit("bid", {
        bid: 0,
        name: "Unknown",
        purchase: true,
        room: auction._id,
      });
      socket.on("message", (res, name, purchase, room) => {
        if (room !== id) return;
        setResBid(res);
        setResName(name);
        setResPurchaseStatus(purchase);
      });
    } catch (error) {
      console.log(error);
    }
  };

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

          <p className="auctionBid">Auction start bid: {auction.bid_start}$</p>
          <p className="auctionPrice">
            Auction purchase price: {auction.purchase_price}$
          </p>
          <span className="auctionTime">Auction status: </span>
          {Object.keys(auction).length !== 0 && (
            <Time
              startDate={auction.start_date}
              startTime={auction.start_time}
              endDate={auction.end_date}
              endTime={auction.end_time}
              auction={auction}
              setStatus={setStatus}
              purchaseStatus={purchaseStatus}
              setWinnerStatus={setWinnerStatus}
              resPurchaseStatus={resPurchaseStatus}
            />
          )}
          {status && !purchaseStatus && user && !resPurchaseStatus && (
            <>
              <p className="auctionCurrentPrice">
                <p>Current auction price: {resBid}$</p>
              </p>
              <p className="auctionCurrentPrice">Bidder: {resName}</p>
              {error.map((e, index) => (
                <Alert variant="danger" key={index}>
                  {e}
                </Alert>
              ))}
              {resError && <Alert variant="danger">{resError}</Alert>}
              <div className="buttons">
                <input
                  type="number"
                  defaultValue={resBid}
                  placeholder="bid"
                  className="bidInput"
                  onChange={(e) => setBid(e.target.value)}
                />
                <button className="bidButton" onClick={handleClick}>
                  Bid
                </button>
                {resBid < auction.purchase_price && (
                  <button className="purchaseButton" onClick={handlePurchase}>
                    Purchase
                  </button>
                )}
                <button className="purchaseButton" onClick={handleAutomaticBid}>
                  Automatic Bid
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <AutomaticBid
        show={modalShow}
        onHide={() => setModalShow(false)}
        user={user}
        auction={auction}
      ></AutomaticBid>
    </div>
  );
};

export default Auction;
