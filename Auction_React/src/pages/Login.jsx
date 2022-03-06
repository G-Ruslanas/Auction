import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resError, setResError] = useState("");
  const login = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        username,
        password,
      },
      withCredentials: true,
      url: "http://localhost:5000/auth/login",
    }).then((res) => {
      if (res.data !== "User with specified credentials not found!") {
        window.location.href = "/";
      } else {
        setResError(res.data);
      }
    });
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Choose a Login Method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <FaGoogle className="icon" />
            Google
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <form className="right" onSubmit={login}>
          <span className="formTitle">Login Form</span>
          {resError && <Alert variant="danger">{resError}</Alert>}
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit">Login</button>
          <span className="formSpan">
            No Account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
