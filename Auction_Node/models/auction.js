const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    start_date: {
      type: String,
      required: true,
      validate: {
        validator: function (startDate) {
          const currentFullDate = new Date();

          const startFullDate = new Date(startDate + " " + this.start_time);
          return currentFullDate.getTime() < startFullDate.getTime();
        },
        message:
          "Please select start (date and time) that is higher than current full date",
      },
    },
    start_time: { type: String, required: true },
    end_date: {
      type: String,
      required: true,
      validate: {
        validator: function (endDate) {
          const startFullDate = new Date(
            this.start_date + " " + this.start_time
          );
          const endFullDate = new Date(endDate + " " + this.end_time);
          return startFullDate.getTime() < endFullDate.getTime();
        },
        message:
          "Please select end (date and time) that is higher than start (date and time)",
      },
    },
    end_time: { type: String, required: true },
    bid_start: { type: Number, required: true, min: 0 },
    purchase_price: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (price) {
          return price > this.bid_start;
        },
        message: "Purchase price should be a higher than bid start",
      },
    },
    img: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", AuctionSchema);
