const router = require("express").Router();
const Bid = require("../models/bid");

//Find bid by auction ID
router.get("/find/:id", async (req, res) => {
  try {
    const bid = await Bid.findOne({ auction_id: req.params.id });
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update bid by auction ID
router.put("/update", async (req, res) => {
  let findBid = await Bid.findOne({ auction_id: req.body.auction_id });
  if (findBid && findBid.length !== 0) {
    if (req.body.bid > findBid.bid) {
      try {
        const updatedBid = await Bid.findOneAndUpdate(
          { auction_id: req.body.auction_id },
          {
            $set: req.body,
          },
          { new: true, runValidators: true }
        );
        res.status(200).json(updatedBid);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      return res.send({
        bid: findBid.bid,
        errors: "Bid should be higher than previous bid on this auction",
      });
    }
  } else {
    const newBid = new Bid(req.body);
    try {
      const savedNewBid = await newBid.save();
      res.status(200).json(savedNewBid);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//Update automatic bid
router.put("/update/automatic", async (req, res) => {
  let arrayOfBids = [];
  for (const bid of req.body) {
    let findBid = await Bid.findOne({
      auction_id: bid.auction_id,
    });

    if (findBid && findBid.length !== 0) {
      try {
        if (findBid.bid < bid.automatic_bid) {
          const updatedBid = await Bid.findOneAndUpdate(
            { auction_id: bid.auction_id },
            {
              user_id: bid.user_id,
              auction_id: bid.auction_id,
              bid: findBid.bid + 1,
            },
            { new: true, runValidators: true }
          );
          arrayOfBids.push(updatedBid);
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      const newBid = new Bid({
        user_id: bid.user_id,
        auction_id: bid.auction_id,
        bid: 1,
      });
      try {
        const savedNewBid = await newBid.save();
        res.status(200).json(savedNewBid);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
  res.status(200).json(arrayOfBids);
});

module.exports = router;
