import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../pages/css/Card.css";
import { FavoriteBorderOutlined } from "@material-ui/icons";
import { Favorite } from "@material-ui/icons";
import { useState } from "react";
import axios from "axios";
const Card = ({ auctions, user, setAuctions }) => {
  const [favorite, setFavorite] = useState([]);
  // const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    auctions.map((auction) => {
      if (auction.favorites.includes(user._id)) {
        if (!favorite.includes(auction._id))
          setFavorite(favorite.concat(auction._id));
      }
    });
  }, [auctions]);

  const setFavoriteAuctions = async (auction) => {
    if (!favorite.includes(auction._id)) {
      setFavorite(favorite.concat(auction._id));
    } else {
      setFavorite(favorite.filter((fav) => fav !== auction._id));
    }
    const data = {
      auction_id: auction._id,
      user_id: user._id,
    };
    try {
      await axios.put("http://localhost:5000/auction/setfavorite", data);
      const res = await axios.get("http://localhost:5000/auction");
      setAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return auctions.map((auction) => (
    <>
      <div className="card">
        <span className="title">{auction.title}</span>
        <img src={`uploads/${auction.img}`} alt="" className="img" />
        <p className="desc">{auction.category}</p>
        <div className="icons">
          <Link className="link" to={`/auction/${auction._id}`}>
            <button className="cardButton">Read More</button>
          </Link>
          <button
            className="iconButton"
            onClick={() => setFavoriteAuctions(auction)}
          >
            {favorite.includes(auction._id) ? (
              <>
                <Favorite color="secondary" fontSize="large" />
              </>
            ) : (
              <>
                <FavoriteBorderOutlined color="secondary" fontSize="large" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  ));
};

export default Card;
