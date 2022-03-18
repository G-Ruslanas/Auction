const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    auction_id: { type: String, required: true },
    bid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
