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

// Create new Auction with image upload
router.post("/", upload.single("auctionImage"), async (req, res) => {
  const newAuction = new Auction({
    ...req.body,
    img: req.file.filename,
    user_id: req.body.seller,
    desc: req.body.description,
  });
  try {
    await newAuction.save((err) => {
      return res.send(err);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Find auctions, sort it by date, statuses
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ start_date: "asc", start_time: "asc" })
      .where({ status: true, valid: "Valid" });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Find all auctions, with status pending
router.get("/all", async (req, res) => {
  try {
    const auctions = await Auction.find().where({
      valid: "Pending",
    });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Find auction by ID
router.get("/find/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Find Auction by User ID
router.get("/findbyuser/:id", async (req, res) => {
  try {
    const auctions = await Auction.find({ user_id: req.params.id });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update auction by ID
router.put("/find/:id", async (req, res) => {
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: false },
      },
      { new: true }
    );
    res.status(200).json(updatedAuction);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Auction validation check for Administrator
router.put("/check", async (req, res) => {
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          valid: req.body.auctionStatus,
          message: req.body.adminComment,
          status: true,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedAuction);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Auction update with image upload
router.put("/update", upload.single("auctionImage"), async (req, res) => {
  const errors = [];
  const currentFullDate = new Date();
  const startFullDate = new Date(
    req.body.start_date + " " + req.body.start_time
  );
  const endFullDate = new Date(req.body.end_date + " " + req.body.end_time);

  if (req.body.bid_start < 0) {
    errors.push("Bid start should be a positive number");
  }

  if (req.body.purchase_price <= 0) {
    errors.push("Purchase price should be a positive number");
  }

  if (parseInt(req.body.purchase_price) < parseInt(req.body.bid_start)) {
    errors.push("Purchase price should be a higher than bid start");
  }

  if (currentFullDate.getTime() > startFullDate.getTime()) {
    errors.push(
      "Please select start (date and time) that is higher than current full date"
    );
  }

  if (currentFullDate.getTime() > endFullDate.getTime()) {
    errors.push(
      "Please select end (date and time) that is higher than current full date"
    );
  }

  if (startFullDate.getTime() > endFullDate.getTime()) {
    errors.push(
      "Please select end (date and time) that is higher than start (date and time)"
    );
  }

  if (errors.length === 0) {
    try {
      if (req.file) {
        const updatedAuction = await Auction.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: req.body,
            img: req.file.filename,
            user_id: req.body.seller,
            desc: req.body.description,
            valid: "Pending",
          },
          { new: true }
        );
        res.status(200).json(updatedAuction);
      } else {
        const updatedAuction = await Auction.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: req.body,
            user_id: req.body.seller,
            desc: req.body.description,
            valid: "Pending",
          },
          { new: true }
        );
        res.status(200).json(updatedAuction);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.send(errors);
  }
});

//Change Auction property to true if no winner after time runs out
router.put("/nowinner", async (req, res) => {
  try {
    const findNoWinner = await Auction.findOneAndUpdate(
      { _id: req.body.auction_id },
      { valid: "No Winner" },
      { new: true }
    );
    res.status(200).json(findNoWinner);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Set favorites for specific user ID
router.put("/setfavorite", async (req, res) => {
  try {
    const findFavorite = await Auction.findOne(
      {
        _id: req.body.auction_id,
      },
      { favorites: { $elemMatch: { $eq: req.body.user_id } } }
    );
    if (findFavorite.favorites.length === 0) {
      const setFavorites = await Auction.findOneAndUpdate(
        { _id: req.body.auction_id },
        { $addToSet: { favorites: req.body.user_id } },
        { new: true }
      );
      res.status(200).json(setFavorites);
    } else {
      const pulledFavorites = await Auction.findOneAndUpdate(
        { _id: req.body.auction_id },
        { $pull: { favorites: req.body.user_id } },
        { new: true }
      );
      res.status(200).json(pulledFavorites);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
