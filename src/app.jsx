import * as React from 'react';
import { TodoForm } from './components/todo-form';
import { TodoList } from './components/todo-list';
import { TodoResults } from './components/todo-results';
import { TodosContext } from './todo-context';
import './index.scss';

const todosTemplate = [
  {
    id: 0,
    label: 'Fix the app to display the list of all tasks',
    checked: false,
  },
  {
    id: 1,
    label: 'Fix the layout so that checkboxes are displayed in a vertical column',
    checked: false,
  },
  {
    id: 2,
    label: 'Fix the functionality to add a new task',
    checked: false,
  },
  {
    id: 3,
    label: 'Fix the functionality to mark a task as completed',
    checked: false,
  },
  {
    id: 4,
    label: 'Fix the functionality to delete a task',
    checked: false,
  },
  {
    id: 5,
    label: 'Fix the task counter to count completed tasks correctly',
    checked: false,
  },
  {
    id: 6,
    label: 'Add a filter to toggle between completed and incomplete tasks',
    checked: false,
  },
  {
    id: 7,
    label: 'Add a search feature to find tasks by text',
    checked: false,
  },
  {
    id: 8,
    label: 'Bonus: Implement pagination or lazy loading if tasks exceed 10',
    checked: false,
  },
  {
    id: 9,
    label: 'Bonus: Write test cases for important functionality',
    checked: false,
  },
  {
    id: 10,
    label: 'Bonus: Add additional UI views (e.g., task detail, stats)',
    checked: false,
  },
];

const App = () => {
  const [todos, setTodosInternal] = React.useState([]);
  const [filter, setFilter] = React.useState('all'); // Filter state
  const [searchTerm, setSearchTerm] = React.useState(''); // Search term state

  // Initialize todos from localStorage or use template if none exist
  React.useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodosInternal(JSON.parse(storedTodos));
    } else {
      setTodosInternal(todosTemplate);
    }
  }, []);

  // Update todos in state and localStorage
  const setTodos = (newTodos) => {
    setTodosInternal(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  // Filter tasks based on selected filter and search term
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'completed') {
        return todo.checked;
      } else if (filter === 'incomplete') {
        return !todo.checked;
      } else {
        return true; // Show all tasks when filter is 'all'
      }
    })
    .filter((todo) => {
      // Filter by search term
      return todo.label.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="root">
      <TodosContext.Provider value={{ todos, setTodos }}>
        {/* Search Input */}
        <div className="search-bar">
          <label htmlFor="search-input" className="visually-hidden">
            Search tasks
          </label>
          <input
            type="text"
            id="search-input"
            className="search-box"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tasks by name"
            aria-describedby="search-helper"
          />
          <span id="search-helper" className="visually-hidden">
            Enter task name to search
          </span>
        </div>

        {/* Task List */}
        <TodoList todos={filteredTodos} setFilter={setFilter} /> {/* Pass filteredTodos to TodoList */}
        
        {/* Task Results (optional) */}
        <TodoResults />

        {/* Form to add new tasks */}
        <TodoForm />
      </TodosContext.Provider>
    </div>
  );
};

export default App;
