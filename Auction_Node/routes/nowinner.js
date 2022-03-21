const router = require("express").Router();
const NoWinner = require("../models/nowinner");

router.put("/", async (req, res) => {
  const findNoWinner = await NoWinner.find({ auction_id: req.body.auction_id });
  if (findNoWinner.length === 0) {
    const newNoWinner = new NoWinner(req.body);
    try {
      const savedNoWinner = await newNoWinner.save((err) => {
        return res.send(err);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const updatedNoWinner = await NoWinner.findOneAndUpdate(
        { auction_id: req.body.auction_id },
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedNoWinner);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
