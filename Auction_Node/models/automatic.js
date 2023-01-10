const mongoose = require("mongoose");
const AutomaticSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    auction_id: { type: String, required: true },
    automatic_bid: {
      type: Number,
    },
    status: { type: String, default: "In Progress" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Automatic", AutomaticSchema);
