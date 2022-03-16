const router = require("express").Router();
const NoWinner = require("../models/nowinner");

router.post("/", async (req, res) => {
  const newNoWinner = new NoWinner(req.body);
  try {
    const savedNoWinner = await newNoWinner.save((err) => {
      return res.send(err);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
