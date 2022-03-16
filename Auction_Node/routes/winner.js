const router = require("express").Router();
const Winner = require("../models/winner");

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

module.exports = router;
