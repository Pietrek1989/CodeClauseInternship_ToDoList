import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFetch } from "./useFetch.js";

const InputModal = ({ addTask, handleClose, handleShow, show, setShow }) => {
  const [toDoForm, setToDoForm] = useState({
    text: "",
  });
  const [GIF, setGIF] = useState("");

  const gifUrl = useFetch({ GIF });

  const handlePost = (e) => {
    e.preventDefault();
    addTask(toDoForm.text, gifUrl); // pass the file as well
    setToDoForm({ text: "" });
    setGIF("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className="text-color">Create a Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column mx-2 my-2">
          <div className="form-outline">
            <Form onSubmit={handlePost}>
              <Form.Group className="form-outline">
                <p className="text-color">Name:</p>
                <Form.Control
                  id="textAreaExample"
                  as="textarea"
                  rows={1}
                  value={toDoForm.text}
                  onChange={(e) => {
                    setToDoForm({
                      ...toDoForm,
                      text: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group className="form-outline mt-2">
                <Form.Label className="text-color">
                  Keyword for GIF(optional)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a gIF for GIF"
                  value={GIF}
                  onChange={(e) => setGIF(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="post-button" onClick={handlePost}>
          POST
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputModal;
