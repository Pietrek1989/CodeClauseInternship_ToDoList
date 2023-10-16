import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { HiTrash } from "react-icons/hi";

const ItemType = {
  TASK: "TASK",
};

export const DraggableTask = ({
  task,
  index,
  column,
  moveTask,
  onTaskClick,
}) => {
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
  const handleClick = () => {
    if (!isDragging) {
      onTaskClick();
    }
  };
  return (
    <div
      ref={ref[1]}
      onClick={handleClick}
      className={`task-item rounded p-2 text-light text-center  ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        display: isDragging ? "none" : "block",
        cursor: ref[0].isDragging ? "grabbing" : "pointer",
      }}
    >
      {task ? task.title : "Loading..."}
      {task && task.img && (
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

export const DroppableTaskList = React.forwardRef(
  ({ tasks, title, moveTask, onTaskClick }, listRef) => {
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
                onTaskClick={() => onTaskClick(task)}
              />
            ))}
        </div>
      </div>
    );
  }
);

export const DroppableBin = ({ deleteTask }) => {
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

export const DroppableColumn = ({ tasks, title, moveTask, onTaskClick }) => {
  const [, ref] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      moveTask(item.index, item.column, title);
    },
  });

  return (
    <div ref={ref} className="taks-containers">
      {" "}
      <DroppableTaskList
        tasks={tasks}
        title={title}
        moveTask={moveTask}
        onTaskClick={onTaskClick}
      />
    </div>
  );
};
