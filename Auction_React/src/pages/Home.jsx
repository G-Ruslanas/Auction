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
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [status, setStatus] = useState(true);

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
    if (Object.keys(filters).length !== 0 && filters.category.length !== 0) {
      const filteredAuctions = auctions.filter((auction) =>
        Object.entries(filters).every(([key, value]) =>
          auction[key].includes(value)
        )
      );
      setFilteredAuctions(filteredAuctions);
    } else {
      setFilteredAuctions([]);
      setStatus(true);
    }
  }, [filters, auctions]);

  useEffect(() => {
    if (sort === "asc") {
      if (filteredAuctions.length !== 0) {
        setFilteredAuctions((prev) => {
          return [...prev].sort(
            (first, second) => first.purchase_price - second.purchase_price
          );
        });
      } else {
        const filteredAuctions = auctions.sort(
          (first, second) => first.purchase_price - second.purchase_price
        );
        setFilteredAuctions(filteredAuctions);
      }
    } else if (sort === "desc") {
      if (filteredAuctions.length !== 0) {
        setFilteredAuctions((prev) => {
          return [...prev].sort(
            (first, second) => second.purchase_price - first.purchase_price
          );
        });
      } else {
        const filteredAuctions = auctions.sort(
          (first, second) => second.purchase_price - first.purchase_price
        );
        setFilteredAuctions(filteredAuctions);
      }
    }
  }, [sort, filteredAuctions.length, auctions]);

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

  const handleFilters = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFilters({ ...filters, [name]: value });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchField.length !== 0) {
      const filteredAuctions = auctions.filter((auction) =>
        auction.title.includes(searchField)
      );
      setStatus(true);
      if (filteredAuctions.length !== 0) {
        setFilteredAuctions(filteredAuctions);
      } else {
        setFilteredAuctions([]);
        setStatus(false);
      }
    } else {
      setFilteredAuctions([...auctions]);
    }
  };
  console.log(filteredAuctions);
  console.log(status);

  return (
    <>
      {user && (
        <>
          <div className="button">
            <div>
              <select name="category" className="btn" onChange={handleFilters}>
                <option value="" selected>
                  Category
                </option>
                <option value="electronic">Electronic</option>
                <option value="music">Music</option>
              </select>
              <select
                name="purchasePrice"
                className="btn"
                onChange={handleSort}
              >
                <option value="" selected>
                  Price
                </option>
                <option value="asc">Price (asc)</option>
                <option value="desc">Price (desc)</option>
              </select>
            </div>
            <button className="btn" onClick={() => setModalShow(true)}>
              + Auction
            </button>

            <div className="searchButtons">
              <input
                type="text"
                className="btn search"
                placeholder="Search.."
                onChange={handleSearch}
              ></input>
              <button
                type="button"
                onClick={handleSearchClick}
                className="btn btn-submit"
              >
                Search
              </button>
            </div>
          </div>
          <AddAuction
            show={modalShow}
            onHide={() => setModalShow(false)}
            user={user}
          ></AddAuction>
        </>
      )}

      <div className="home">
        {filteredAuctions.length !== 0 ? (
          filteredAuctions.map((auction) => (
            <Card key={auction._id} auction={auction} />
          ))
        ) : status ? (
          auctions.map((auction) => (
            <Card key={auction._id} auction={auction} />
          ))
        ) : (
          <h1 className="noAuctions">No Auctions Found</h1>
        )}
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
                      className="slider_image img-fluid"
                    />
                  </div>
                  <div className="slider_info">
                    <div>
                      <h1 className="slider_h1">
                        Auction Title: {winner.title}
                      </h1>
                      <h1 className="slider_h1">
                        Auction Category: {winner.category}
                      </h1>
                      <h1 className="slider_h1">
                        Auction Winner: {winner.username}
                      </h1>
                      <h1 className="slider_h1">
                        Auction price: {winner.price}
                      </h1>
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
