const router = require("express").Router();
const Auction = require("../models/auction");
const multer = require("multer");
const path = require("path");

const whiteList = ["image/png", "image/jpeg", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../Auction_React/public/uploads"));
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (!whiteList.includes(file.mimetype)) {
      return callback(new Error("File is not allowed"));
    }
    callback(null, true);
  },
});

router.post("/", upload.single("auctionImage"), async (req, res) => {
  const newAuction = new Auction({
    ...req.body,
    img: req.file.filename,
    user_id: req.body.seller,
    desc: req.body.description,
  });
  try {
    const savedAuction = await newAuction.save((err) => {
      return res.send(err);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ start_date: "asc", start_time: "asc" })
      .limit(6);
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    res.status(200).json(auction);
  } catch (error) {
    res.send(err);
    res.status(500).json(error);
  }
});

module.exports = router;
