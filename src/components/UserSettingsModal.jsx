import React from "react";
import { Modal, Button } from "react-bootstrap";

const UserSettingsModal = ({ show, handleClose, handleLogout }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>{/* Settings form will go here */}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSettingsModal;
