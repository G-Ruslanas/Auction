import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

const EditUser = ({ show, onHide, user }) => {
  const [fileName, setFileName] = useState("");
  const [resError, setResError] = useState([]);
  const [error, setError] = useState([]);
  const [state, setState] = useState({
    username: user.username,
    email: user.email,
    current_password: "",
    new_password: "",
    new_repeat_password: "",
  });
  const onChangeFile = (e) => {
    setFileName(e.target.files[0]);
    state.profileImage = fileName.name;
  };

  const handleState = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleClick = () => {
    onHide();
    setError([]);
    setResError([]);
    setState({
      username: user.username,
      email: user.email,
      current_password: "",
      new_password: "",
      new_repeat_password: "",
    });
    setFileName("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const errors = [];
    state.id = user._id;

    const formData = new FormData();
    formData.append("id", state.id);
    formData.append("username", state.username || user.username);
    formData.append("default_username", user.username);
    formData.append("email", state.email || user.email);
    formData.append("default_email", user.email);
    formData.append("current_password", state.current_password);
    formData.append("new_password", state.new_password);
    formData.append("new_repeat_password", state.new_repeat_password);
    formData.append("profileImage", fileName);

    // //Test if some data was modified
    if (
      state.username === user.username &&
      state.email === user.email &&
      state.current_password.length === 0 &&
      state.new_password.length === 0 &&
      state.new_repeat_password.length === 0 &&
      !fileName
    ) {
      errors.push("No data was modified!");
    }

    if (state.username.length < 8) {
      errors.push("Username should be at least 8 characters long");
    }
    const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (fileName) {
      if (!imgTypes.includes(fileName.type)) {
        errors.push("Please select image with appropriate extention");
      }
    }

    setError(errors);

    if (errors.length === 0) {
      try {
        const res = await axios.put(
          "http://localhost:5000/user/update",
          formData
        );
        const status = Array.isArray(res.data);
        if (status) {
          setResError(res.data);
        } else {
          setResError([]);
          onHide(false);
          setState({
            username: user.username,
            email: user.email,
            current_password: "",
            new_password: "",
            new_repeat_password: "",
          });
          window.open("http://localhost:5000/auth/logout", "_self");
        }
        setError([]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error.map((e, index) => (
            <Alert variant="danger" key={index}>
              {e}
            </Alert>
          ))}
          {resError.map((e, index) => (
            <Alert variant="danger" key={index}>
              {e}
            </Alert>
          ))}
          <Row>
            <Col>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                required
                defaultValue={user.username}
                onChange={handleState}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                name="email"
                defaultValue={user.email}
                onChange={handleState}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                filename="profileImage"
                name="profileImage"
                onChange={onChangeFile}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="current_password"
                onChange={handleState}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="new_password"
                onChange={handleState}
              />
            </Col>
            <Col>
              <Form.Label>Repeat New Password</Form.Label>
              <Form.Control
                type="password"
                name="new_repeat_password"
                onChange={handleState}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClick}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Edit
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditUser;
