const mongoose = require("mongoose");
const NoWinnerSchema = new mongoose.Schema(
  {
    auction_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoWinner", NoWinnerSchema);
