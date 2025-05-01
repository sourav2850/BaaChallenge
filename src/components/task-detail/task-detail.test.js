import { render, screen, fireEvent } from '@testing-library/react';
import TaskDetail from './TaskDetail'; // Assuming the path to the TaskDetail component

describe('TaskDetail Component', () => {
  const task = {
    id: 1,
    label: 'Test Task',
    checked: false,
    description: 'This is a task description',
  };

  it('should render task details', () => {
    render(<TaskDetail task={task} />);

    expect(screen.getByText(/Test Task/)).toBeInTheDocument();
    expect(screen.getByText(/This is a task description/)).toBeInTheDocument();
  });

  it('should toggle checked status when checkbox is clicked', () => {
    render(<TaskDetail task={task} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true); // Assuming clicking the checkbox toggles the `checked` state
  });

  it('should allow editing task description', () => {
    render(<TaskDetail task={task} />);

    const editButton = screen.getByText(/Edit/); // Assuming there's an "Edit" button
    fireEvent.click(editButton);

    const inputField = screen.getByLabelText(/Description/); // Assuming the input has a label 'Description'
    fireEvent.change(inputField, { target: { value: 'Updated description' } });

    expect(inputField.value).toBe('Updated description');
  });

  it('should render a message when no task is provided', () => {
    render(<TaskDetail task={null} />);

    expect(screen.getByText(/No task details available/)).toBeInTheDocument();
  });
});
