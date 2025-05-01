import React, { useState, useEffect } from 'react';
import { TodosContext } from '../../todo-context';
import './todo-form.scss';

export const TodoForm = () => {
  const { todos, setTodos } = React.useContext(TodosContext);
  const [task, setTask] = useState('');
  const [showInput, setShowInput] = useState(false); // Track if the input should be visible

  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const handleAddTodo = () => {
    if (task.trim() !== '') {
      // Sequential ID logic: Increment the ID based on the current tasks
      const newTask = {
        id: todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 0, // Ensure sequential ID
        label: task,
        checked: false,
      };
      
      // Add the new task to the front of the list
      const updatedTodos = [newTask, ...todos]; // This makes the new task appear at the top
      setTodos(updatedTodos); // Update the state with the new task at the top
      saveTodosToLocalStorage(updatedTodos);
      setTask(''); // Clear the input field after adding a task
      setShowInput(false); // Hide the input field after submitting the task
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Detect Enter key press
      handleAddTodo();
    }
  };

  const handleResize = () => {
    // Reset showInput to false if screen is resized and input is not focused
    if (window.innerWidth > 640) {
      setShowInput(false);
    }
  };

  // Reattach resize event listener on component mount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="todo-form">
      {!showInput ? (
        <span
          className="add-task-btn"
          onClick={() => setShowInput(true)} // Show the input field and button when clicked
          aria-label="Add new task"
        >
          + Add Task
        </span>
      ) : (
        <div className="add-task-input-container">
          <input
            className="add-task-input"
            placeholder="Enter new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown} // Detect Enter key
            aria-label="New task input" // Accessibility
          />
          <button
            type="button"
            onClick={handleAddTodo}
            className="add-btn"
            aria-label="Add new task" // Added aria-label for accessibility
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};


