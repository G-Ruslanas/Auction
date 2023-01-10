import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const CheckStatus = ({ show, onHide, user, auction }) => {
  return (
    <Modal size="lg" show={show} centered>
      <form>
        <Modal.Header>
          <Modal.Title>Check Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Auction Status Message</Form.Label>
          <Form.Control value={auction.message} readOnly></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CheckStatus;
