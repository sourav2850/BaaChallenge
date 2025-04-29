import React from 'react';
import './task-detail.scss'

export const TaskDetail = ({ task, onClose }) => {
  return (
    <div className="task-detail" role="dialog" aria-labelledby="task-detail-title" aria-hidden="false">
      <h2 id="task-detail-title">Task Detail</h2>
      <p><strong>Task:</strong> {task.label}</p>
      <p><strong>Status:</strong> {task.checked ? 'Completed' : 'Incomplete'}</p>
      <button 
        onClick={onClose} 
        aria-label="Close task details" 
        className="close-button"
      >
        Close
      </button>
    </div>
  );
};
