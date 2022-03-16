const router = require("express").Router();
const Bid = require("../models/bid");

router.get("/find/:id", async (req, res) => {
  try {
    const bid = await Bid.findOne({ auction_id: req.params.id });
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update", async (req, res) => {
  let findBid = await Bid.findOne({ auction_id: req.body.auction_id });
  if (findBid.length !== 0) {
    if (req.body.bid > findBid.bid) {
      try {
        const updatedBid = await Bid.findOneAndUpdate(
          { auction_id: req.body.auction_id },
          {
            $set: req.body,
          },
          { new: true, runValidators: true }
        );
        return res.status(200).json(updatedBid);
      } catch (err) {
        return res.send(err);
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
      return res.status(200).json(savedNewBid);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
});

module.exports = router;
