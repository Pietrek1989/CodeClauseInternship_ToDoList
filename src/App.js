import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import InputModal from "./components/InputModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HiPlus, HiTrash } from "react-icons/hi";
import NavBar from "./components/Nav";
import { Toaster, toast } from "sonner";

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
      {task.title}
      {task.img && (
        <>
          <img
            src={task.img}
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
          {tasks &&
            tasks.map((task, i) => (
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
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });

  const updateTasks = async (updatedTasks) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/users/me/tasks`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ tasks: updatedTasks }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks); // Update local state with the returned tasks
      } else {
        console.error("Failed to update tasks:", await response.text());
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
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

    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/users/me/tasks`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tasks: newTasks }),
      }
    );

    if (response.ok) {
      setTasks(newTasks);
    } else {
      // Handle error
      console.error("Failed to update tasks");
    }
  };

  const deleteTask = async (fromIndex, fromColumn) => {
    const newTasks = { ...tasks };
    const fromKey = mapTitleToStateKey(fromColumn);
    newTasks[fromKey].splice(fromIndex, 1);

    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/users/me/tasks`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tasks: newTasks }),
      }
    );

    if (response.ok) {
      setTasks(newTasks);
      toast.error("Task has been deleted");
    } else {
      console.error("Failed to update tasks");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}/users/me/info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Add this line to log the data
          setTasks(data.tasks);
        } else {
          console.error("Failed to fetch tasks:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster richColors position="bottom-center" closeButton />

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
