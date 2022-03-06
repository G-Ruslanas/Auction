import React from "react";
import Card from "../components/Card";
import { auctions } from "../data";

const Home = () => {
  return (
    <div className="home">
      {auctions.map((auction) => (
        <Card key={auction.id} auction={auction} />
      ))}
    </div>
  );
};

export default Home;
