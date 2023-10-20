import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import InputModal from "./components/InputModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HiPlus } from "react-icons/hi";
import NavBar from "./components/Nav";
import { Toaster, toast } from "sonner";
import { DroppableBin, DroppableColumn } from "./components/collumnFunctions";
import { taskRequests } from "./components/useFetch";
import TaskModal from "./components/TaskModal";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ResetPasswordPage from "./components/ResetPasswordPage";

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tasks, setTasks] = useState({
    version: 0,
    todo: [],
    doing: [],
    done: [],
  });

  const [taskModal, setTaskModal] = useState({
    show: false,
    task: null,
  });
  const handleTaskClick = (task) => {
    setTaskModal({
      show: true,
      task,
    });
  };
  const updateTasks = async (updatedTasks) => {
    const data = await taskRequests("PUT", "/users/me/tasks", {
      tasks: updatedTasks,
    });
    return data;
  };

  const addTask = async (newTask, file) => {
    const taskObject = { title: newTask, img: file };
    const updatedTasks = {
      ...tasks,
      todo: [...tasks.todo, taskObject],
    };

    const data = await updateTasks(updatedTasks);
    if (data && data.tasks) {
      // Update the local state with the server response
      setTasks(data.tasks);
      toast.success("New task created");
    } else {
      toast.error("Failed to create new task");
      console.error("Unexpected data format:", data);
    }
  };

  const mapTitleToStateKey = (title) => {
    const mapping = {
      "To Do": "todo",
      Doing: "doing",
      Done: "done",
    };
    return mapping[title];
  };

  const moveTask = async (fromIndex, fromColumn, toColumn, dropTargetIndex) => {
    const previousTasks = { ...tasks }; // Save the previous state

    try {
      const newTasks = { ...tasks };
      const fromKey = mapTitleToStateKey(fromColumn);
      const toKey = mapTitleToStateKey(toColumn);
      const [movedTask] = newTasks[fromKey].splice(fromIndex, 1);
      newTasks[toKey].splice(dropTargetIndex, 0, movedTask);

      setTasks(newTasks); // Update the UI optimistically

      if (fromColumn !== toColumn) {
        // If moving across columns, update the movedAt property
        const moveDetail = { column: toKey, time: new Date().toISOString() };
        movedTask.movedAt = [...(movedTask.movedAt || []), moveDetail];
      }

      // Send the request to update all tasks
      const data = await updateTasks(newTasks);
      if (data && data.tasks && data.tasks.version > tasks.version) {
        setTasks(data.tasks); // Update state with server response
      } else {
        console.error("Unexpected data format:", data);
        setTasks(previousTasks); // Revert to previous state if there's an error
      }
    } catch (error) {
      console.error("Failed to move task:", error);
      setTasks(previousTasks); // Revert to previous state if there's an error
    }
  };

  const deleteTask = async (fromIndex, fromColumn) => {
    const newTasks = { ...tasks };
    const fromKey = mapTitleToStateKey(fromColumn);
    newTasks[fromKey].splice(fromIndex, 1);
    const data = await taskRequests("PUT", "/users/me/tasks", {
      tasks: newTasks,
    });
    if (data) {
      setTasks(data.tasks);
      toast.error("Task has been deletedd");
    }
  };

  const fetchTasks = async () => {
    if (localStorage.getItem("accessToken")) {
      const data = await taskRequests("GET", "/users/me/info");
      // console.log("Fetched tasks:", data);
      if (data) setTasks(data.tasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Toaster richColors position="bottom-right" closeButton />
        <div className="d-flex flex-column justify-content-between h-screen App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className=" d-flex flex-column">
                    <NavBar fetchTasks={fetchTasks} setTasks={setTasks} />

                    <Container className="text-center w-100 d-flex justify-content-between align-items-center">
                      <Button
                        onClick={handleShow}
                        className="w-100 add-task-button mt-1"
                      >
                        ADD NEW <HiPlus />
                      </Button>
                    </Container>
                    <Container className="d-flex justify-content-between text-center big-container-task w-100">
                      {tasks ? (
                        <>
                          <div className="to-do-container taks-containers">
                            <DroppableColumn
                              tasks={tasks.todo}
                              title="To Do"
                              moveTask={moveTask}
                              onTaskClick={handleTaskClick}
                            />
                          </div>
                          <div className="doing-container taks-containers">
                            <DroppableColumn
                              tasks={tasks.doing}
                              title="Doing"
                              moveTask={moveTask}
                              onTaskClick={handleTaskClick}
                            />
                          </div>

                          <div className="done-container taks-containers">
                            <DroppableColumn
                              tasks={tasks.done}
                              title="Done"
                              moveTask={moveTask}
                              onTaskClick={handleTaskClick}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center full-screen">
                          <div>PLEASE LOG IN...</div>
                        </div>
                      )}
                    </Container>

                    <InputModal
                      addTask={(newTask, newFile) => addTask(newTask, newFile)}
                      handleClose={handleClose}
                      handleShow={handleShow}
                      show={show}
                      setShow={setShow}
                    />
                    <TaskModal
                      show={taskModal.show}
                      task={taskModal.task}
                      onHide={() => setTaskModal({ show: false, task: null })}
                    />
                  </div>
                  <DroppableBin deleteTask={deleteTask} />
                </>
              }
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </div>
      </DndProvider>
    </BrowserRouter>
  );
};

export default App;
