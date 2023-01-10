import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons";
import AddAuction from "../components/AddAuction";
import Pagination from "../components/Pagination";
import Card from "../components/Card";
import "./css/Home.css";
import { Toggle } from "../components/Toggle";
import UserBanned from "../components/UserBanned";

const Home = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [userBannedModal, setUserBannedModal] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [winnersInfo, setWinnersInfo] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [status, setStatus] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(1);
  const [users, setUsers] = useState([]);

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
    const getUsers = async () => {
      try {
        await axios.get("http://localhost:5000/user/find");
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    if (
      Object.keys(filters).length !== 0 &&
      (filters.user_id !== "" ||
        filters.category !== "" ||
        filters.favorites !== "")
    ) {
      const filteredAuctions = auctions.filter((auction) =>
        Object.entries(filters).every(([key, value]) =>
          auction[key].includes(value)
        )
      );
      setFilteredAuctions(filteredAuctions);
      setStatus(false);
    } else {
      setFilteredAuctions([]);
      setStatus(true);
    }
  }, [filters]);

  useEffect(() => {
    if (sort === "asc") {
      if (filteredAuctions.length !== 0) {
        setFilteredAuctions((prev) => {
          return [...prev].sort(
            (first, second) => first.purchase_price - second.purchase_price
          );
        });
      } else {
        setAuctions((prev) => {
          return [...prev].sort(
            (first, second) => first.purchase_price - second.purchase_price
          );
        });
      }
    } else if (sort === "desc") {
      if (filteredAuctions.length !== 0) {
        setFilteredAuctions((prev) => {
          return [...prev].sort(
            (first, second) => second.purchase_price - first.purchase_price
          );
        });
      } else {
        setAuctions((prev) => {
          return [...prev].sort(
            (first, second) => second.purchase_price - first.purchase_price
          );
        });
      }
    }
  }, [sort, filteredAuctions.length, auctions.length]);

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
    if (name === "category") {
      if (value !== "") {
        setFilters({ ...filters, [name]: value });
      } else {
        value === "" && delete filters.category && setFilters({ ...filters });
      }
    }

    if (name === "user_id") {
      if (value !== "") {
        setFilters({ ...filters, [name]: value });
      } else {
        value === "" && delete filters.user_id && setFilters({ ...filters });
      }
    }
  };

  const handleFilter = (state) => {
    state
      ? setFilters({ ...filters, favorites: user._id })
      : delete filters.favorites && setFilters({ ...filters });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchField.length !== 0) {
      if (filters?.category === undefined && sort === "") {
        const filteredAuctions = auctions.filter((auction) =>
          auction.title.includes(searchField)
        );
        setFilteredAuctions(filteredAuctions);
        setStatus(false);
      } else {
        const filteredAuctionsBySearch = filteredAuctions.filter((auction) =>
          auction.title.includes(searchField)
        );
        setFilteredAuctions(filteredAuctionsBySearch);
        setStatus(false);
      }
    } else {
      if (filters?.category !== undefined || sort !== "") {
        if (sort === "asc") {
          if (filteredAuctions.length !== 0) {
            setFilteredAuctions((prev) => {
              return [...prev].sort(
                (first, second) => first.purchase_price - second.purchase_price
              );
            });
          }
        } else if (sort === "desc") {
          if (filteredAuctions.length !== 0) {
            setFilteredAuctions((prev) => {
              return [...prev].sort(
                (first, second) => second.purchase_price - first.purchase_price
              );
            });
          }
        }
        if (
          Object.keys(filters).length !== 0 &&
          (filters.user_id !== "" ||
            filters.category !== "" ||
            filters.favorites !== "")
        ) {
          setFilteredAuctions(
            auctions.filter((auction) =>
              Object.entries(filters).every(([key, value]) =>
                auction[key].includes(value)
              )
            )
          );
        }
      } else {
        setFilteredAuctions([...auctions]);
      }
    }
  };

  // Get current auctions
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = auctions.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );
  const currentFilteredAuctions = filteredAuctions.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    // setFilters({ category: "", user_id: "" });
    delete filters.category && setFilters({ ...filters });
    delete filters.user_id && setFilters({ ...filters });
    setSort("");
    setSearchField("");
  };

  return (
    <>
      {user && (
        <>
          <div className="mainPage">
            <div className="button">
              <button
                className="btn btn-submit"
                onClick={() =>
                  user.status === "Active"
                    ? setModalShow(true)
                    : setUserBannedModal(true)
                }
              >
                + Auction
              </button>
              <select
                name="category"
                className="btn"
                onChange={handleFilters}
                value={filters?.category ? filters.category : ""}
              >
                <option value="" selected>
                  Category
                </option>
                <option value="electronic">Electronic</option>
                <option value="music">Music</option>
                <option value="games">Games</option>
                <option value="other">Other</option>
              </select>
              <Toggle label="Favorite" toggled={false} onClick={handleFilter} />
              <select
                name="purchasePrice"
                className="btn"
                onChange={handleSort}
                value={sort}
              >
                <option value="" selected>
                  Price
                </option>
                <option value="asc">Price (asc)</option>
                <option value="desc">Price (desc)</option>
              </select>
              <select
                name="user_id"
                className="btn"
                onChange={handleFilters}
                value={filters?.user_id ? filters.user_id : ""}
              >
                <option value="" selected>
                  Seller
                </option>
                {users.map((user, index) => (
                  <>
                    <option value={user._id} key={index}>
                      {user.username}
                    </option>
                  </>
                ))}
              </select>
              <input
                type="text"
                className="btn search"
                placeholder="Type something.."
                onChange={handleSearch}
                value={searchField}
              ></input>
              <p className="clearFilters" onClick={() => clearFilters()}>
                Clear filters
              </p>
              <button
                type="button"
                onClick={handleSearchClick}
                className="btn btn-submit"
              >
                Search
              </button>
            </div>
            <div className="home">
              <div className="home">
                {filteredAuctions.length !== 0 ? (
                  <>
                    <Card
                      auctions={currentFilteredAuctions}
                      user={user}
                      setAuctions={setAuctions}
                    />
                  </>
                ) : status ? (
                  <>
                    <Card
                      auctions={currentAuctions}
                      user={user}
                      setAuctions={setAuctions}
                    />
                  </>
                ) : (
                  <h1 className="noAuctions">No Auctions Found</h1>
                )}
              </div>
              <div className="paginationStyle">
                {filteredAuctions.length !== 0 ? (
                  <>
                    <Pagination
                      auctionsPerPage={auctionsPerPage}
                      totalAuctions={filteredAuctions.length}
                      paginate={paginate}
                    />
                  </>
                ) : status ? (
                  <Pagination
                    auctionsPerPage={auctionsPerPage}
                    totalAuctions={auctions.length}
                    paginate={paginate}
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
          <AddAuction
            show={modalShow}
            onHide={() => setModalShow(false)}
            user={user}
          ></AddAuction>
          <UserBanned
            show={userBannedModal}
            onHide={() => setUserBannedModal(false)}
            user={user}
          ></UserBanned>
        </>
      )}

      {/* Slider */}
      <h1 className="profileAuctions">Recent won auctions</h1>
      <div className="sliderBody">
        {winnersInfo.map((winner, index) => {
          if (index === current) {
            return (
              <>
                <div className="slider_info">
                  <div>
                    <h1 className="slider_h1">Title: {winner.title}</h1>
                    <h1 className="slider_h1">Category: {winner.category}</h1>
                  </div>
                </div>
                <div className="sliderTop">
                  <ArrowLeftOutlined className="arrow" onClick={prevSlide} />
                  <div className="frame">
                    <div className="sliderMain">
                      <img
                        src={`uploads/${winner.img}`}
                        alt={winner._id}
                        className="image"
                      />
                    </div>
                  </div>
                  <ArrowRightOutlined className="arrow" onClick={nextSlide} />
                </div>
                <div className="slider_info">
                  <div>
                    <h1 className="slider_h1">Winner: {winner.username}</h1>
                    <h1 className="slider_h1">Price: {winner.price} $</h1>
                  </div>
                </div>
              </>
            );
          }
          return false;
        })}
      </div>
    </>
  );
};

export default Home;
