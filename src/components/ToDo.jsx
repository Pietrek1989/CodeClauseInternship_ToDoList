import React from "react";

const ToDo = ({ tasks, moveToDoing }) => {
  return (
    <div>
      <h2>ToDo</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.text}
            {task.file && (
              <img
                src={URL.createObjectURL(task.file)}
                alt={task.file.name}
                width="50"
              />
            )}
            <button onClick={() => moveToDoing(index)}>Move to Doing</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;
