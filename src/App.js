import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import InputModal from "./components/InputModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HiPlus } from "react-icons/hi";

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task, index, column, moveTask }) => {
  const [isDragging, setIsDragging] = useState(false);

  const ref = useDrag({
    type: ItemType.TASK,
    item: { index, column },
    collect: (monitor) => {
      const isCurrentlyDragging = monitor.isDragging();
      setIsDragging(isCurrentlyDragging);
      return { isDragging: isCurrentlyDragging };
    },
  });

  return (
    <div
      ref={ref[1]}
      className={`task-item rounded p-2 text-light text-center ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        display: isDragging ? "none" : "block",
        cursor: ref[0].isDragging ? "grabbing" : "pointer",
      }}
    >
      {task.text}
      {task.file && (
        <>
          <img
            src={task.file}
            alt="task-related-file"
            width="50"
            height="50"
            className="m-3"
          />
        </>
      )}
    </div>
  );
};

const DroppableTaskList = ({ tasks, title, moveTask }) => {
  const [, ref] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      moveTask(item.index, item.column, title);
    },
  });

  return (
    <div className="task-list-wrapper" ref={ref}>
      {" "}
      {/* Wrapped entire list and title with ref */}
      <h3>{title}</h3>
      <div className="task-list">
        {tasks.map((task, i) => (
          <DraggableTask
            key={i}
            index={i}
            task={task}
            column={title}
            moveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return { todo: [], doing: [], done: [] };
  });

  // Update localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask, file, gifUrl) => {
    const taskObject = { text: newTask, file, gifUrl };
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, taskObject],
    }));
  };
  const mapTitleToStateKey = (title) => {
    const mapping = {
      "To Do": "todo",
      Doing: "doing",
      Done: "done",
    };
    return mapping[title];
  };

  const moveTask = (fromIndex, fromColumn, toColumn) => {
    const newTasks = { ...tasks };

    const fromKey = mapTitleToStateKey(fromColumn);
    const toKey = mapTitleToStateKey(toColumn);

    const [movedTask] = newTasks[fromKey].splice(fromIndex, 1);
    newTasks[toKey].push(movedTask);

    setTasks(newTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App d-flex flex-column">
        <Container className="text-center">
          <Button onClick={handleShow} className="w-100 add-task-button">
            ADD NEW <HiPlus />
          </Button>
        </Container>
        <Container className="d-flex justify-content-between text-center big-container-task w-100">
          <div className="to-do-container taks-containers">
            <DroppableTaskList
              tasks={tasks.todo}
              title="To Do"
              moveTask={moveTask}
            />
          </div>
          <div className="doing-container taks-containers">
            <DroppableTaskList
              tasks={tasks.doing}
              title="Doing"
              moveTask={moveTask}
            />
          </div>

          <div className="done-container taks-containers">
            <DroppableTaskList
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
    </DndProvider>
  );
};

export default App;
