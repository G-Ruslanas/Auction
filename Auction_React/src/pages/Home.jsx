import axios from "axios";
import React, { useEffect, useState } from "react";
import AddAuction from "../components/AddAuction";
import Card from "../components/Card";

const Home = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [auctions, setAuctions] = useState([]);

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
    </>
  );
};

export default Home;
