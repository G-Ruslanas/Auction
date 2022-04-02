const router = require("express").Router();
const Winner = require("../models/winner");
const Auction = require("../models/auction");

router.put("/", async (req, res) => {
  const findWinner = await Winner.find({ auction_id: req.body.auction_id });
  if (findWinner.length === 0) {
    const newWinner = new Winner(req.body);
    try {
      const savedWinner = await newWinner.save((err) => {
        return res.send(err);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const updatedWinner = await Winner.findOneAndUpdate(
        { auction_id: req.body.auction_id },
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedWinner);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const wonAuctions = await Winner.find({
      user_id: req.params.id,
      paid: false,
    });

    const response = [];
    let price = 0;
    for (const obj of wonAuctions) {
      const wonAuctionInfo = await Auction.findOne({
        _id: obj.auction_id,
      });

      wonAuctionInfo.purchase_price = obj.price;
      response.push(wonAuctionInfo);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/paid", async (req, res) => {
  try {
    const paidWonAuction = await Winner.findOneAndUpdate(
      { auction_id: req.body.id },
      {
        $set: { paid: true },
      },
      { new: true }
    );
    res.status(200).json(paidWonAuction);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const allWinners = await Winner.find()
      .sort({ createdAt: "desc" })
      // .where({paid: true})
      .limit(3);

    res.status(200).json(allWinners);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
