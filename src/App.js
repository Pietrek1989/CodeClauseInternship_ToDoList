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

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });

  const updateTasks = async (updatedTasks) => {
    const data = await taskRequests("PUT", "/users/me/tasks", {
      tasks: updatedTasks,
    });
    if (data) setTasks(data.tasks);
  };

  const addTask = async (newTask, file) => {
    const taskObject = { title: newTask, img: file };
    const updatedTasks = {
      ...tasks,
      todo: [...tasks.todo, taskObject],
    };

    await updateTasks(updatedTasks);
    toast.success("New task created");
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
    const newTasks = { ...tasks };
    const fromKey = mapTitleToStateKey(fromColumn);
    const toKey = mapTitleToStateKey(toColumn);
    const [movedTask] = newTasks[fromKey].splice(fromIndex, 1);
    newTasks[toKey].splice(dropTargetIndex, 0, movedTask); // Updated to insert the task at the correct index

    const data = await taskRequests("PUT", "/users/me/tasks", {
      tasks: newTasks,
    });
    if (data) setTasks(data.tasks);
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
      toast.error("Task has been deleted");
    }
  };
  const fetchTasks = async () => {
    const data = await taskRequests("GET", "/users/me/info");
    if (data) setTasks(data.tasks);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster richColors position="bottom-right" closeButton />

      <div className="d-flex flex-column justify-content-between h-screen App">
        <div className=" d-flex flex-column">
          <NavBar fetchTasks={fetchTasks} setTasks={setTasks} />

          <Container className="text-center w-100 d-flex justify-content-between align-items-center">
            <Button onClick={handleShow} className="w-100 add-task-button mt-1">
              ADD NEW <HiPlus />
            </Button>
          </Container>
          <Container className="d-flex justify-content-between text-center big-container-task w-100">
            <div className="to-do-container taks-containers">
              <DroppableColumn
                tasks={tasks.todo}
                title="To Do"
                moveTask={moveTask}
              />
            </div>
            <div className="doing-container taks-containers">
              <DroppableColumn
                tasks={tasks.doing}
                title="Doing"
                moveTask={moveTask}
              />
            </div>

            <div className="done-container taks-containers">
              <DroppableColumn
                tasks={tasks.done}
                title="Done"
                moveTask={moveTask}
              />
            </div>
          </Container>

          <InputModal
            addTask={(newTask, newFile) => addTask(newTask, newFile)}
            handleClose={handleClose}
            handleShow={handleShow}
            show={show}
            setShow={setShow}
          />
        </div>
        <DroppableBin deleteTask={deleteTask} />
      </div>
    </DndProvider>
  );
};

export default App;
