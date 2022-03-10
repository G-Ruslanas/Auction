const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const User = require("./models/user");
const authRoute = require("./routes/auth");
const cors = require("cors");

const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require("./passportGoogle");
require("./passportLocal");

const auctionRouter = require("./routes/auction");
const { addUser, removeUser, addSocketId } = require("./users");

mongoose
  .connect(
    "mongodb+srv://Ruslanas:raHNTxsUDbjytvP6@cluster0.bfmig.mongodb.net/Auction?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connection Successfully"))
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

//socket
io.on("connection", (socket) => {
  socket.on("join", ({ username }, callback) => {
    const users = addUser({ id: socket.id, name: username });
    console.log(users);
  });
  socket.on("disconnectUser", ({ username }, callback) => {
    removeUser(username);
  });
});
//socket

app.use("/auth", authRoute);
app.use("/auction", auctionRouter);

server.listen("5000", () => {
  console.log("Server is running on port 5000");
});
