import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Alert } from "react-bootstrap";
import axios from "axios";

const EditAuction = ({ show, onHide, user, auction, setAuction }) => {
  const [state, setState] = useState({
    id: auction._id,
    seller: user._id,
    title: auction.title,
    category: auction.category,
    description: auction.desc,
    start_date: auction.start_date,
    start_time: auction.start_time,
    end_date: auction.end_date,
    end_time: auction.end_time,
    bid_start: auction.bid_start,
    purchase_price: auction.purchase_price,
  });
  const [error, setError] = useState([]);
  const [resError, setResError] = useState([]);
  const [fileName, setFileName] = useState("");

  const onChangeFile = (e) => {
    setFileName(e.target.files[0]);
  };

  const handleState = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const errors = [];

    const formData = new FormData();
    formData.append("id", state.id);
    formData.append("bid_start", state.bid_start);
    formData.append("category", state.category);
    formData.append("description", state.description);
    formData.append("end_date", state.end_date);
    formData.append("end_time", state.end_time);
    formData.append("purchase_price", state.purchase_price);
    formData.append("seller", state.seller);
    formData.append("start_date", state.start_date);
    formData.append("start_time", state.start_time);
    formData.append("title", state.title);
    formData.append("auctionImage", fileName);

    if (!state.category) {
      errors.push("Please select auction category");
    }

    const currentFullDate = new Date();
    const startFullDate = new Date(state.start_date + " " + state.start_time);
    const endFullDate = new Date(state.end_date + " " + state.end_time);

    if (currentFullDate.getTime() > startFullDate.getTime()) {
      errors.push(
        "Please select start (date and time) that is higher than current full date"
      );
    }

    if (currentFullDate.getTime() > endFullDate.getTime()) {
      errors.push(
        "Please select end (date and time) that is higher than current full date"
      );
    }

    if (startFullDate.getTime() > endFullDate.getTime()) {
      errors.push(
        "Please select end (date and time) that is higher than start (date and time)"
      );
    }

    if (state.bid_start < 0) {
      errors.push("Bid start should be a positive number ");
    }

    if (state.purchase_price <= 0) {
      errors.push("Purchase price should be a positive number");
    }

    if (parseInt(state.purchase_price) < parseInt(state.bid_start)) {
      errors.push("Purchase price should be a higher than bid start");
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
          "http://localhost:5000/auction/update",
          formData
        );
        const status = Array.isArray(res.data);

        if (status) {
          setResError(res.data);
        } else {
          setResError([]);
          onHide(false);
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClick = () => {
    onHide();
    setAuction({});
  };

  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm} encType="multipart/form-data">
        <Modal.Header>
          <Modal.Title>Create Auction</Modal.Title>
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
              <Form.Label>Auction Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                onChange={handleState}
                defaultValue={auction.title}
              />
            </Col>
            <Col>
              <Form.Label>Auction Category</Form.Label>
              <Form.Select
                name="category"
                required
                onChange={handleState}
                defaultValue={auction.category}
              >
                <option disabled value="default">
                  Choose Category
                </option>
                <option value="electronic">Electronic</option>
                <option value="music">Music</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Description</Form.Label>
              <Form.Control
                type="text"
                required
                name="description"
                onChange={handleState}
                defaultValue={auction.desc}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Start Date</Form.Label>
              <Form.Control
                type="date"
                required
                name="start_date"
                onChange={handleState}
                defaultValue={auction.start_date}
              />
              <Form.Label>Auction Start Time</Form.Label>
              <Form.Control
                type="time"
                required
                name="start_time"
                onChange={handleState}
                defaultValue={auction.start_time}
              />
            </Col>
            <Col>
              <Form.Label>Auction End Date</Form.Label>
              <Form.Control
                type="date"
                required
                name="end_date"
                onChange={handleState}
                defaultValue={auction.end_date}
              />
              <Form.Label>Auction End Time</Form.Label>
              <Form.Control
                type="time"
                required
                name="end_time"
                onChange={handleState}
                defaultValue={auction.end_time}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Auction Bid Start</Form.Label>
              <Form.Control
                type="number"
                required
                name="bid_start"
                onChange={handleState}
                defaultValue={auction.bid_start}
              />
            </Col>
            <Col>
              <Form.Label>Auction Purchase Price</Form.Label>
              <Form.Control
                type="number"
                required
                name="purchase_price"
                onChange={handleState}
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
              <Form.Label>Auction Image</Form.Label>
              <Form.Control
                type="file"
                // required
                filename="auctionImage"
                name="auctionImage"
                onChange={onChangeFile}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClick}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add Auction
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditAuction;
