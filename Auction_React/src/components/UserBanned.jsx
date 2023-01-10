import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const UserBanned = ({ show, onHide, user }) => {
  return (
    <Modal size="lg" show={show} centered>
      <form>
        <Modal.Header>
          <Modal.Title>Suspended User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>
            Your user was suspended until{" "}
            {user.suspension &&
              user.suspension.substring(0, user.suspension.indexOf("GMT"))}
            because of trying to post inappropriate auctions!
          </Form.Label>
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

export default UserBanned;
