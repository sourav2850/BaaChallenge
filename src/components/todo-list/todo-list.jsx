import React, { useContext, useState, useEffect } from 'react';
import { TodosContext } from '../../todo-context';
import { Checkbox } from '../checkbox';
import { TaskDetail } from '../task-detail/task-detail';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Eye, Pencil, X } from 'lucide-react';
import './todo-list.scss';

export const TodoList = ({ todos, setFilter }) => {
  const { todos: allTodos, setTodos } = useContext(TodosContext);

  const [viewMode, setViewMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedLabel, setEditedLabel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = todos.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.max(1, Math.ceil(todos.length / tasksPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [todos, totalPages]);

  const handleDelete = (id) => {
    const updatedTodos = allTodos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleCheck = (id) => {
    const updatedTodos = allTodos.map(todo =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    setTodos(updatedTodos);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setViewMode('detail');
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedLabel(task.label);
  };

  const handleSaveEdit = () => {
    const updatedTodos = allTodos.map(todo =>
      todo.id === editingTaskId ? { ...todo, label: editedLabel } : todo
    );
    setTodos(updatedTodos);
    setEditingTaskId(null);
    setEditedLabel('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedLabel('');
  };

  const handleSaveDetails = (updatedTask) => {
    const updatedTodos = allTodos.map(todo =>
      todo.id === updatedTask.id ? updatedTask : todo
    );
    setTodos(updatedTodos);
    setViewMode(null);
    setSelectedTask(null);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const updatedTodos = Array.from(allTodos);
    const [movedItem] = updatedTodos.splice(source.index, 1);
    updatedTodos.splice(destination.index, 0, movedItem);

    setTodos(updatedTodos);
  };

  return (
    <div className="todo-list">
      {viewMode === 'detail' && selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => {
            setViewMode(null);
            setSelectedTask(null);
          }}
          onSave={handleSaveDetails}
        />
      )}

      {!viewMode && (
        <>
          <span className="todo-list-title">Things to do:</span>

          {todos.length ? (
            <div className="todo-list-content">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="todoList">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {currentTasks.map((todoItem, index) => (
                        <Draggable
                          key={todoItem.id}
                          draggableId={todoItem.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className={`todo-item 
                                ${todoItem.checked ? 'done' : ''} 
                                ${!todoItem.checked && todoItem.priority === 'high' ? 'priority-high' : ''} 
                                ${!todoItem.checked && todoItem.priority === 'medium' ? 'priority-medium' : ''}
                                ${!todoItem.checked && todoItem.priority === 'low' ? 'priority-low' : ''}
                              `}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="left-section">
                                {editingTaskId === todoItem.id ? (
                                  <input
                                    type="text"
                                    value={editedLabel}
                                    onChange={(e) => setEditedLabel(e.target.value)}
                                    className="edit-input"
                                    autoFocus
                                  />
                                ) : (
                                  <Checkbox
                                    label={<span>{todoItem.label}</span>}
                                    checked={todoItem.checked}
                                    onClick={() => toggleCheck(todoItem.id)}
                                  />
                                )}
                              </div>

                              <div className="task-buttons">
                                {editingTaskId === todoItem.id ? (
                                  <>
                                    <button onClick={handleSaveEdit}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                  </>
                                ) : (
                                  <>
                                    <Eye onClick={() => handleViewDetails(todoItem)} />
                                    <Pencil onClick={() => handleEditTask(todoItem)} />
                                    <X onClick={() => handleDelete(todoItem.id)} />
                                  </>
                                )}
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
            <div>No tasks yet!</div>
          )}

          <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

          <div className="filter-buttons">
            <button onClick={() => setFilter('all')}>All Tasks</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
            <button onClick={() => setFilter('incomplete')}>Incomplete</button>
          </div>
        </>
      )}
    </div>
  );
};
