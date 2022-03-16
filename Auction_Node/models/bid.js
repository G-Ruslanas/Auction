const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    auction_id: { type: String, required: true },
    bid: {
      type: Number,
      required: true,
      // validate: {
      //   validator: function (bids) {
      //     prevbid = this.bid;
      //     console.log(prevbid);
      //     // console.log(this.user_id);
      //     // console.log(bids, this.bid);
      //     return bids > 10;
      //   },
      //   message: "Bid should be higher than bid start of this auction",
      // },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
