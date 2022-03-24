const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
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

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update", upload.single("profileImage"), async (req, res) => {
  let errors = [];
  try {
    let valid = false;
    let newPassValid = false;
    let lengthValid = false;
    const new_password = req.body.new_password;
    const repeat_password = req.body.new_repeat_password;
    const current_password = req.body.current_password;

    //Test current password match
    const user = await User.findById({ _id: req.body.id });
    const status = await bcrypt.compare(current_password, user.password);
    if (!status && current_password.length !== 0) {
      errors.push("Current password do not match");
    } else {
      valid = true;
    }

    //Test new password match
    if (
      new_password.length !== 0 &&
      repeat_password.length !== 0 &&
      new_password !== repeat_password
    ) {
      errors.push("Passwords do not match");
    } else {
      newPassValid = true;
    }

    if (
      (new_password.length < 8 || repeat_password.length) < 8 &&
      (new_password.length !== 0 || repeat_password.length !== 0)
    ) {
      errors.push("New password less than 8 characters long");
    } else {
      lengthValid = true;
    }

    //Test that all password fields are filled
    if (
      current_password.length === 0 &&
      new_password.length !== 0 &&
      repeat_password.length !== 0 &&
      lengthValid &&
      newPassValid
    ) {
      errors.push("Fill all passwords fields correctly to change password");
    }

    //Test if user with username or email exist already
    const foundUser = await User.findOne({
      $and: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (
      foundUser &&
      (foundUser.username !== req.body.username ||
        foundUser.email !== req.body.email)
    ) {
      errors.push("User with same username or email already exists");
    }

    if (errors.length === 0) {
      let hashedPassword = "";
      if (new_password.length !== 0 && repeat_password.length !== 0) {
        hashedPassword = await bcrypt.hash(req.body.new_password, 10);
      } else {
        hashedPassword = user.password;
      }
      errors = [];
      if (req.file) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: req.body,
            password: hashedPassword,
            img: req.file.filename,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: req.body,
            password: hashedPassword,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      }
    } else {
      res.send(errors);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
