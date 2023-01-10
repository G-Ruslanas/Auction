import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const AutomaticBid = ({ show, onHide, user, auction }) => {
  const [automaticBid, setAutomaticBid] = useState(0);

  const handleState = (evt) => {
    const value = evt.target.value;
    setAutomaticBid(value);
  };
  const submitForm = async (e) => {
    e.preventDefault();
    const data = {
      user_id: user._id,
      auction_id: auction == null ? auction._id : auction,
      automatic_bid: automaticBid,
    };
    try {
      await axios.put("http://localhost:5000/automatic/autobid", data);
      onHide(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <Modal.Header>
          <Modal.Title>Automatic Bid System</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Label>Maximum bid</Form.Label>
              <Form.Control
                type="number"
                required
                name="bid_max"
                onChange={handleState}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Create Automatic Bid
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AutomaticBid;
