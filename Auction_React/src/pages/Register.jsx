import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const [resError, setResError] = useState("");
  const register = (e) => {
    e.preventDefault();
    const errors = [];

    if (username.length < 8) {
      errors.push("Username should be at least 8 characters");
    }
    if (password !== confirmPassword) {
      errors.push("Password does not match");
    }

    if (password.length < 8) {
      errors.push("Password should be at least 8 characters");
    }
    setError(errors);
    if (errors.length === 0) {
      axios({
        method: "POST",
        data: {
          username,
          password,
          email,
        },
        withCredentials: true,
        url: "http://localhost:5000/auth/register",
      }).then((res) => {
        if (res.data !== "Account with same credentials already exist") {
          window.location.href = "/login";
        } else {
          setResError(res.data);
        }
      });
    }
  };

  console.log(resError);

  return (
    <div className="register">
      <div className="wrapper">
        <form className="right" onSubmit={register}>
          <span className="formTitle">Registration Form</span>
          {error.map((e) => (
            <Alert variant="danger">{e}</Alert>
          ))}
          {resError && <Alert variant="danger">{resError}</Alert>}
          <input
            type="text"
            placeholder="username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="confirmpassword"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="submit">Register</button>
          <span className="formSpan">
            Have An Account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
