const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, require: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
