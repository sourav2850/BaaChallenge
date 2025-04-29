import * as React from 'react';
import './checkbox.scss';

export const Checkbox = ({
  onClick, checked, onDelete, label, onKeyUp,
}) => (
  <div className="checkbox">
    <div
      tabIndex="0"
      role="checkbox"
      aria-checked={checked} // Dynamically set ARIA state based on the checked prop
      className="checkbox-content"
      onKeyUp={onKeyUp}
    >
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onClick} // Handle state change when checkbox is clicked
        aria-label={label} // Make the checkbox label accessible
      />
      <span className={checked ? 'checkbox-checked' : ''}>{label}</span>
    </div>
    <button
      type="button"
      className="checkbox-delete"
      onClick={onDelete}
      aria-label="Delete task" // Adding an accessible label for the delete button
    >
      x
    </button>
  </div>
);
