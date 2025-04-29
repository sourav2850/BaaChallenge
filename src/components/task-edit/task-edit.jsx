import React, { useState } from 'react';
import './task-edit.scss'

export const TaskEdit = ({ task, onSave, onCancel }) => {
  const [newLabel, setNewLabel] = useState(task.label);

  const handleSave = () => {
    onSave(task.id, newLabel);
  };

  return (
    <div className="task-edit" role="dialog" aria-labelledby="task-edit-title" aria-hidden="false">
      <h2 id="task-edit-title">Edit Task</h2>

      <label htmlFor="task-label-input" className="sr-only">Task Label</label>
      <input
        id="task-label-input"
        type="text"
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        placeholder="Edit task label"
        aria-label="Edit task label"
        autoFocus
      />

      <div className="task-edit-buttons">
        <button
          onClick={handleSave}
          aria-label="Save changes"
          className="save-button"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          aria-label="Cancel editing"
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
