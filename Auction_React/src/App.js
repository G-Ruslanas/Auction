import Navbar from "./components/Navbar";
import "./app.css";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import io from "socket.io-client";
import axios from "axios";

var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

var socket = io.connect("http://localhost:5000", connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [usersOnline, setUsersOnline] = useState([]);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:5000/automatic/all");
        const result = res.data.reduce(function (r, a) {
          r[a.auction_id] = r[a.auction_id] || [];
          r[a.auction_id].push(a);
          return r;
        }, Object.create(null));
        const data = Object.keys(result).map((res) => {
          return result[res];
        });

        const maxBid = data.map((res) =>
          Math.max(...res.map((o) => o.automatic_bid))
        );

        var finalMax = [];
        for (const max of maxBid) {
          finalMax.push(
            data.map((e) => e.filter((b) => b.automatic_bid === max))
          );
        }

        finalMax = finalMax.flat(1).flat(1);
        try {
          const res = await axios.put(
            "http://localhost:5000/bid/update/automatic",
            finalMax
          );

          res.data.map(async (r) => {
            const findUser = await axios.get(
              `http://localhost:5000/user/find/${r.user_id}`
            );
            if (r.user_id === findUser.data._id) {
              socket.emit("bid", {
                bid: r.bid,
                name: findUser.data.username,
                purchase: false,
                room: r.auction_id,
              });
            }
          });
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        header: {
          Accept: "application/json",
          "Content-Type": "application/sjon",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Authentication has been failed!");
          }
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  useEffect(() => {
    user && socket.emit("addUser", user._id);
    socket.on("getUsers", (users) => {
      setUsersOnline(users);
    });
  }, [user, socket]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} socket={socket} />
        <Routes>
          <Route
            path="/"
            element={!user ? <Navigate to="/login" /> : <Home user={user} />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login socket={socket} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/chat"
            element={
              user ? (
                <Chat user={user} socket={socket} usersOnline={usersOnline} />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/cart"
            element={user ? <Cart user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/auction/:id"
            element={<Auction user={user} socket={socket} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
