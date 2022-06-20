import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

const CheckAuction = ({ show, onHide, user, auction }) => {
  const [state, setState] = useState({
    _id: auction._id,
    adminComment: "",
    auctionStatus: "",
  });
  const [error, setError] = useState("");

  const handleState = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      if (state.adminComment !== "" && state.auctionStatus !== "") {
        setError("");
        const res = await axios.put(
          "http://localhost:5000/auction/check",
          state
        );
        onHide();
      } else {
        setError("Please fill all fields!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <Modal.Header>
          <Modal.Title>Create Auction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col>
              <Form.Label>Auction Image</Form.Label>
              <br />
              <img src={`uploads/${auction.img}`} className="img-fluid"></img>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                readOnly
                defaultValue={auction.title}
              />
            </Col>
            <Col>
              <Form.Label>Auction Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                defaultValue={auction.category}
                readOnly
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                readOnly
                defaultValue={auction.desc}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                readOnly
                defaultValue={auction.start_date}
              />
              <Form.Label>Auction Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                readOnly
                defaultValue={auction.start_time}
              />
            </Col>
            <Col>
              <Form.Label>Auction End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                readOnly
                defaultValue={auction.end_date}
              />
              <Form.Label>Auction End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                readOnly
                defaultValue={auction.end_time}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Bid Start</Form.Label>
              <Form.Control
                type="number"
                name="bid_start"
                readOnly
                defaultValue={auction.bid_start}
              />
            </Col>
            <Col>
              <Form.Label>Auction Purchase Price</Form.Label>
              <Form.Control
                type="number"
                name="purchase_price"
                readOnly
                defaultValue={auction.purchase_price}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Seller</Form.Label>
              <Form.Control
                type="text"
                value={(user && user.username) || user.displayName}
                readOnly
              />
            </Col>
            <Col>
              <Form.Label>Auction Status </Form.Label>

              <Form.Select
                name="auctionStatus"
                defaultValue="default"
                onChange={handleState}
              >
                <option disabled value="default">
                  Choose Status
                </option>
                <option value="Valid">Valid</option>
                <option value="Invalid">Invalid</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Form.Label>Admin Comment</Form.Label>
            <Form.Control
              type="text"
              name="adminComment"
              onChange={handleState}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CheckAuction;
