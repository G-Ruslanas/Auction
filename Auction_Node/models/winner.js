const mongoose = require("mongoose");
const WinnerSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    auction_id: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Winner", WinnerSchema);
