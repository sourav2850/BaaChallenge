import React, { useState } from 'react';
import { TodosContext } from '../../todo-context';
import './todo-form.scss';

export const TodoForm = () => {
  const { todos, setTodos } = React.useContext(TodosContext);
  const [task, setTask] = useState('');

  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const handleAddTodo = () => {
    if (task.trim() !== '') {
      const newTask = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 0,
        label: task,
        checked: false,
      };
      const updatedTodos = [...todos, newTask];
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
      setTask(''); // Clear the input field after adding a task
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Detect Enter key press
      handleAddTodo();
    }
  };

  return (
    <div className="todo-form">
      <input
        placeholder="Enter new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown} // Changed to onKeyDown for better response
        aria-label="New task input" // Added an aria-label for accessibility
      />
      <button
        type="button"
        onClick={handleAddTodo}
        aria-label="Add new task" // Added aria-label for accessibility
      >
        Add task
      </button>
    </div>
  );
};
