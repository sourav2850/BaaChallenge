import React, { useState, useEffect } from 'react';
import './task-detail.scss';

export const TaskDetail = ({ task, onClose, onSave }) => {
  const [priority, setPriority] = useState(task.priority || null);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  const handleSave = () => {
    onSave({ ...task, priority, dueDate });
  };

  return (
    <div className="task-detail-modal-overlay">
      <div className="task-detail-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Task Details</h2>
        
        <div className="task-detail-content">
          <div className="task-info">
            <strong>Task:</strong>
            <p>{task.label}</p>
          </div>
          
          <div className="priority-selector">
            <strong>Priority:</strong>
            <div className="priority-options">
              {['High', 'Medium', 'Low'].map((level) => (
                <button
                  key={level}
                  className={`priority-btn ${priority === level ? 'active ' + level.toLowerCase() : ''}`}
                  onClick={() => setPriority(priority === level ? null : level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="task-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
