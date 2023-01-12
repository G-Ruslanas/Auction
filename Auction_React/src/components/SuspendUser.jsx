import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";

const SuspendUser = ({ show, onHide, user, status }) => {
  const [state, setState] = useState({});

  const handleState = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = {
      _id: user._id,
      status: status,
      period: state.suspension_period,
    };
    try {
      const res = axios.put(`http://localhost:5000/user/modify`, data);
      onHide();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Label>Username</Form.Label>
              <Form.Control defaultValue={user && user.username} disabled />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control defaultValue={user && user.email} disabled />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Action</Form.Label>
              <Form.Control value={user && status} disabled />
            </Col>
          </Row>
          {status === "Suspend" && (
            <Row>
              <Col>
                <Form.Label>Suspension Period</Form.Label>
                <Form.Select
                  onChange={handleState}
                  name="suspension_period"
                  required
                >
                  <option selected value="">
                    Period
                  </option>
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                </Form.Select>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => onHide(true)}>
            Close
          </Button>
          {status === "Activate" ? (
            <Button variant="primary" type="submit">
              Activate
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Suspend
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default SuspendUser;
