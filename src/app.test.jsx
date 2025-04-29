// App.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './app'; // Adjust path based on your structure


describe('Todo App', () => {
  test('renders Todo app components', () => {
    render(<App />);
    
    // Check if the form, input, and button exist
    expect(screen.getByPlaceholderText(/Add new task/i)).toBeInTheDocument(); // Input field
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument(); // Add Task button

    // Check if the task list is rendered initially
    expect(screen.getByText(/No Todos/i)).toBeInTheDocument();
  });

  test('can add a new Todo task', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Add new task/i);
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    // Add new task
    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(addButton);

    // Wait for the task to appear in the list
    await waitFor(() => {
      expect(screen.getByText(/Test Todo/i)).toBeInTheDocument();
    });
  });

  test('marks task as completed (checkbox)', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Add new task/i);
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    // Add a task
    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    
    // Initially, the task is not checked
    expect(checkbox).not.toBeChecked();

    // Check the checkbox
    fireEvent.click(checkbox);
    
    // After clicking, the task should be marked as completed
    expect(checkbox).toBeChecked();
    expect(screen.getByText(/Task 1/i)).toHaveClass('todo-item-checked'); // Check for strike-through or class change
  });

  test('can delete a Todo task', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Add new task/i);
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    // Add a task
    fireEvent.change(input, { target: { value: 'Task to Delete' } });
    fireEvent.click(addButton);

    // Find delete button for the added task
    const deleteButton = screen.getByRole('button', { name: /Delete/i });

    // Delete the task
    fireEvent.click(deleteButton);

    // Verify the task is no longer in the list
    await waitFor(() => {
      expect(screen.queryByText(/Task to Delete/i)).not.toBeInTheDocument();
    });
  });

  test('filters tasks by status', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Add new task/i);
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    // Add tasks
    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: 'Task 2' } });
    fireEvent.click(addButton);

    // Mark Task 1 as completed
    const checkbox1 = screen.getByLabelText(/Task 1/i);
    fireEvent.click(checkbox1);

    // Filter completed tasks
    const filterButton = screen.getByRole('button', { name: /Completed/i });
    fireEvent.click(filterButton);

    // Verify that only completed tasks are shown
    await waitFor(() => {
      expect(screen.queryByText(/Task 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Task 2/i)).not.toBeInTheDocument();
    });
  });

  test('displays "No Todos" message when no tasks are available', () => {
    render(<App />);

    // Verify that the message is displayed when no tasks exist
    expect(screen.getByText(/No Todos/i)).toBeInTheDocument();
  });

  test('handles loading state correctly', () => {
    render(<App />);

    // Simulate loading state (mocking a delay)
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: /Load Tasks/i }));

    // Ensure loading text shows during task load
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
    // After a delay, it should show the tasks
    jest.advanceTimersByTime(1000);
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
});

