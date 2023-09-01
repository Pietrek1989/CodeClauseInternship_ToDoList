import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import InputModal from "./components/InputModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task, index, column, moveTask }) => {
  const ref = useDrag({
    type: ItemType.TASK,
    item: { index, column },
  })[1];

  return (
    <div ref={ref} className="bg-dark rounded p-2 text-light text-center">
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
  const ref = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      moveTask(item.index, item.column, title);
    },
  })[1];

  return (
    <div ref={ref}>
      <h3>{title}</h3>
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
  );
};

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
  });
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
        <Container>
          <Button onClick={handleShow}>+</Button>
        </Container>
        <Container className="d-flex justify-content-around text-center">
          <DroppableTaskList
            tasks={tasks.todo}
            title="To Do"
            moveTask={moveTask}
            className="bg-dark"
          />
          <DroppableTaskList
            tasks={tasks.doing}
            title="Doing"
            moveTask={moveTask}
          />
          <DroppableTaskList
            tasks={tasks.done}
            title="Done"
            moveTask={moveTask}
          />
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
