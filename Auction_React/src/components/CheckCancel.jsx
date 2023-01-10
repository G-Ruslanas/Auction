import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const CheckCancel = ({ show, onHide, auction }) => {
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      axios.put(`http://localhost:5000/automatic/findAndCancel/${auction._id}`);
      onHide();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal size="lg" show={show} centered>
      <form onSubmit={submitForm}>
        <Modal.Header>
          <Modal.Title>Cancellation request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>
            Are you sure that you would like to cancel your automatic bid on
            particular auction?
          </Form.Label>
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

export default CheckCancel;
