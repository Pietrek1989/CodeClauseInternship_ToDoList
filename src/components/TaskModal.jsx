import React from "react";
import { Modal } from "react-bootstrap";

const TaskModal = ({ show, task, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {task && (
          <>
            <img src={task.img} alt="Task gif" className="w-100" />
            <h4 className="my-3 mb-5 d-flex justify-content-between created-paragraph">
              CREATED:{" "}
              <span className="text-decoration-underline ml-auto">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "Date not available"}
              </span>
            </h4>
            {task.movedAt &&
              task.movedAt.map((move, index) => (
                <div key={index} className="move-info">
                  <div className="line"></div> Moved to{"  "}
                  <span className="text-uppercase fw-bolder mx-1">
                    {move.column}{" "}
                  </span>{" "}
                  on {new Date(move.time).toLocaleString()}
                </div>
              ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
