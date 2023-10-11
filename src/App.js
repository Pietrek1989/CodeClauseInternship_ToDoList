import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import InputModal from "./components/InputModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HiPlus, HiTrash } from "react-icons/hi";
import NavBar from "./components/Nav";

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task, index, column }) => {
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
      className={`task-item rounded p-2 text-light text-center  ${
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
            width="75"
            height="75"
            className="m-2 task-image"
          />
        </>
      )}
    </div>
  );
};

const DroppableTaskList = React.forwardRef(
  ({ tasks, title, moveTask }, listRef) => {
    const [, ref] = useDrop({
      accept: ItemType.TASK,
      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        const listClientRect = listRef.current.getBoundingClientRect();
        const taskHeight = 48;

        let dropTargetIndex = Math.floor(
          (clientOffset.y - listClientRect.top) / taskHeight
        );

        if (dropTargetIndex < 0) dropTargetIndex = 0;
        if (dropTargetIndex > tasks.length) dropTargetIndex = tasks.length;

        moveTask(item.index, item.column, title, dropTargetIndex);
      },
    });

    return (
      <div className="task-list-wrapper">
        <h3>{title}</h3>
        <div className="task-list" ref={listRef}>
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
  }
);

const DroppableBin = ({ deleteTask }) => {
  const [, ref] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      deleteTask(item.index, item.column);
    },
  });

  return (
    <div ref={ref} className="bin">
      <HiTrash size={40} />
    </div>
  );
};

const DroppableColumn = ({ tasks, title, moveTask }) => {
  const [, ref] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      moveTask(item.index, item.column, title);
    },
  });

  return (
    <div ref={ref} className="taks-containers">
      {" "}
      <DroppableTaskList tasks={tasks} title={title} moveTask={moveTask} />
    </div>
  );
};

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [deletingTask, setDeletingTask] = useState(null);

  const todoListRef = useRef(null);
  const doingListRef = useRef(null);
  const doneListRef = useRef(null);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return { todo: [], doing: [], done: [] };
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask, file) => {
    const taskObject = { text: newTask, file };
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

  const deleteTask = (fromIndex, fromColumn) => {
    const newTasks = { ...tasks };
    const fromKey = mapTitleToStateKey(fromColumn);
    newTasks[fromKey].splice(fromIndex, 1);
    setTasks(newTasks);
    setDeletingTask({ fromIndex, fromColumn });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="d-flex flex-column justify-content-between h-screen App">
        <div className=" d-flex flex-column">
          <NavBar />

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
                ref={todoListRef}
              />
            </div>
            <div className="doing-container taks-containers">
              <DroppableColumn
                tasks={tasks.doing}
                title="Doing"
                moveTask={moveTask}
                ref={doingListRef}
              />
            </div>

            <div className="done-container taks-containers">
              <DroppableColumn
                tasks={tasks.done}
                title="Done"
                moveTask={moveTask}
                ref={doneListRef}
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
