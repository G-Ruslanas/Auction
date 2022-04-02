import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons";
import AddAuction from "../components/AddAuction";
import Card from "../components/Card";

const Home = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [winnersInfo, setWinnersInfo] = useState([]);

  useEffect(() => {
    const getAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auction");
        setAuctions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuctions();
  }, []);

  useEffect(() => {
    const getWinners = async () => {
      try {
        let winnerInfoArray = [];

        const response = await axios.get("http://localhost:5000/winner");

        for (const data of response.data) {
          const resUser = await axios.get(
            `http://localhost:5000/user/find/${data.user_id}`
          );
          const resAuction = await axios.get(
            `http://localhost:5000/auction/find/${data.auction_id}`
          );

          let combineInfo = {
            ...resUser.data,
            ...resAuction.data,
            ...data,
          };
          winnerInfoArray.push(combineInfo);
        }
        setWinnersInfo(winnerInfoArray);
      } catch (error) {
        console.log(error);
      }
    };
    getWinners();
  }, []);

  const nextSlide = () => {
    setCurrent(current === winnersInfo.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? winnersInfo.length - 1 : current - 1);
  };

  return (
    <>
      {user && (
        <>
          <div className="button">
            <button className="btn" onClick={() => setModalShow(true)}>
              + Auction
            </button>
          </div>
          <AddAuction
            show={modalShow}
            onHide={() => setModalShow(false)}
            user={user}
          ></AddAuction>
        </>
      )}

      <div className="home">
        {auctions.map((auction) => (
          <Card key={auction._id} auction={auction} />
        ))}
      </div>

      {/* Slider */}
      <h1 className="profileAuctions">Last Winners</h1>
      <div className="slider">
        <div className="left_arrow" onClick={prevSlide}>
          <ArrowLeftOutlined />
        </div>
        <div>
          {winnersInfo.map((winner, index) => {
            if (index === current) {
              return (
                <div className="slider_wrapper" key={winner._id}>
                  <div className="slider_imageCont">
                    <img
                      src={`uploads/${winner.img}`}
                      alt={winner._id}
                      className="slider_image"
                    />
                  </div>
                  <div className="slider_info">
                    <div>
                      <h1 className="slider_title">
                        Auction Title: {winner.title}
                      </h1>
                      <h1 className="slider_category">
                        Auction Category: {winner.category}
                      </h1>
                      <h1>Auction Winner: {winner.username}</h1>
                      <h1>Auction price: {winner.price}</h1>
                    </div>
                  </div>
                </div>
              );
            }
            return false;
          })}
        </div>
        <div className="right_arrow" onClick={nextSlide}>
          <ArrowRightOutlined />
        </div>
      </div>
    </>
  );
};

export default Home;
