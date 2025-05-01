import React from 'react';
import { TodosContext } from '../../todo-context';
import './todo-results.scss';

export const TodoResults = () => {
  const { todos } = React.useContext(TodosContext);

  // Calculate the number of completed tasks
  const completedTasks = todos.filter(todo => todo.checked).length;

  // Calculate the remaining tasks
  const remainingTasks = todos.length - completedTasks;

  return (
    <div className="todo-results">
      <div className="task-count">
        <span>Completed tasks: {completedTasks} </span>
        <span>Remaining tasks: {remainingTasks}</span>
      </div>
    </div>
  );
};

