import React from 'react';
import { Checkbox } from '../checkbox';
import { TodosContext } from '../../todo-context';
import { TaskDetail } from '../task-detail/task-detail';
import { TaskEdit } from '../task-edit/task-edit';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './todo-list.scss';

export const TodoList = ({ todos, setFilter }) => {
  const { setTodos } = React.useContext(TodosContext);

  const [viewMode, setViewMode] = React.useState(null); // 'detail', 'edit', or null
  const [selectedTask, setSelectedTask] = React.useState(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const tasksPerPage = 10;

  // Paginate tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  // Sort tasks by ID (latest first)
  const sortedTodos = [...todos].sort((a, b) => b.id - a.id);

  // Slice sorted tasks for pagination
  const currentTasks = sortedTodos.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(todos.length / tasksPerPage);

  // Handle Task Reordering (on drag end)
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list or no movement, do nothing
    if (!destination || source.index === destination.index) return;

    // Reorder tasks array based on the drag position
    const reorderedTodos = Array.from(todos); // Create a copy of the todos array
    const [removed] = reorderedTodos.splice(source.index, 1); // Remove the dragged item
    reorderedTodos.splice(destination.index, 0, removed); // Insert the item at the new position

    // Update the state with the reordered todos
    setTodos(reorderedTodos); // This will trigger a re-render with the new order
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleCheck = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    setTodos(updatedTodos);
  };

  const handleKeyUp = (e, id) => {
    if (e.keyCode === 13) { // Enter key
      toggleCheck(id);
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setViewMode('detail');
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setViewMode('edit');
  };

  const handleSaveEdit = (id, newLabel) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, label: newLabel } : todo
    );
    setTodos(updatedTodos);
    setViewMode(null);
    setSelectedTask(null);
  };

  const handleCancelEditOrCloseDetail = () => {
    setViewMode(null);
    setSelectedTask(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="todo-list">
      {viewMode === 'detail' && selectedTask && (
        <TaskDetail task={selectedTask} onClose={handleCancelEditOrCloseDetail} />
      )}

      {viewMode === 'edit' && selectedTask && (
        <TaskEdit
          task={selectedTask}
          onSave={handleSaveEdit}
          onCancel={handleCancelEditOrCloseDetail}
        />
      )}

      {!viewMode && (
        <>
          <span className="todo-list-title">Things to do:</span>
          {todos.length ? (
            <div className="todo-list-content">
              {/* Drag-and-Drop Context */}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="todoList">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {currentTasks.map((todoItem, index) => (
                        <Draggable key={todoItem.id} draggableId={todoItem.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              className="todo-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Checkbox
                                label={todoItem.label}
                                checked={todoItem.checked}
                                onClick={() => toggleCheck(todoItem.id)}
                                onKeyUp={(e) => handleKeyUp(e, todoItem.id)}
                                onDelete={() => handleDelete(todoItem.id)}
                              />
                              <div className="task-buttons">
                                <button onClick={() => handleViewDetails(todoItem)}>
                                  View Details
                                </button>
                                <button onClick={() => handleEditTask(todoItem)}>
                                  Edit
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="no-todos">Looks like you&apos;re up for a challenge!</div>
          )}

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button className="filter-btn" onClick={() => setFilter('all')}>
              All Tasks
            </button>
            <button className="filter-btn" onClick={() => setFilter('completed')}>
              Completed
            </button>
            <button className="filter-btn" onClick={() => setFilter('incomplete')}>
              Incomplete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
