const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 8 },
    password: { type: String, minlength: 8 },
    email: { type: String },
    img: { type: String },
    googleId: { type: String },
    role: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
