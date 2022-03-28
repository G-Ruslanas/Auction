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

const App = () => {
  const [user, setUser] = useState(null);

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

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/cart"
            element={user ? <Cart user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/" />}
          />
          <Route path="/auction/:id" element={<Auction user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
