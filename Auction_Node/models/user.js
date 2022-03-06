const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String },
    role: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
