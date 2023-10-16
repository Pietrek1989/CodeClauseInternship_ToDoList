import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFetch } from "./useFetch";
import { toast } from "sonner";

const UserSettingsModal = ({
  show,
  handleClose,
  handleLogout,
  fetchUserData,
  userData,
}) => {
  const [newUsername, setNewUsername] = useState("");
  const [GIF, setGIF] = useState("");

  const gifUrl = useFetch({ GIF });

  const handlePost = async () => {
    console.log("new username", newUsername, "new avatar", gifUrl);
    const body = {
      username: newUsername || userData.username,
    };
    if (GIF) {
      body.avatar = gifUrl;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/users/me/info`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      fetchUserData();
      handleClose();
      toast.success("User info has been changed");
    } else {
      console.error("Failed to update user info:", await response.text());
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around align-items-center">
          <h2 className="pl-5">{userData?.username}</h2>

          <img
            src={userData?.avatar}
            alt={`${userData?.username}'s avatar`}
            className="rounded h-50 w-50"
          />
        </div>
        <Form>
          <Form.Group className="form-outline mt-2">
            <Form.Label className="text-color">Change your Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-outline mt-2">
            <Form.Label className="text-color">Change GIF avatar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new keyword"
              value={GIF}
              onChange={(e) => setGIF(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="post-button" onClick={handlePost}>
          Change avatar or username
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSettingsModal;
