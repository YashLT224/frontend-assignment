import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HighLightProjects from '../Components/HighRatedProjects/index'; // Assuming App is the file containing your component
import React from 'react';

// Mock the global fetch function to avoid making real network requests
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, "percentage.funded": 50, "amt.pledged": 5000 },
        { id: 2, "percentage.funded": 75, "amt.pledged": 7500 },
        { id: 3, "percentage.funded": 60, "amt.pledged": 6000 },
        { id: 4, "percentage.funded": 80, "amt.pledged": 8000 },
        { id: 5, "percentage.funded": 90, "amt.pledged": 9000 },
        { id: 6, "percentage.funded": 40, "amt.pledged": 4000 },
      ])
    })
  );
});

afterAll(() => {
  global.fetch.mockRestore();
});

// Test: Should show the loader while data is loading
test('should show loading state when data is being fetched', async () => {
  render(<HighLightProjects />);
  
  // Initially, the "Loading..." text should be visible
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
  // Wait for the component to finish loading the data and render the table
  await waitFor(() => screen.getByText(/Kickstarter Projects/i));
  
  // After loading, the loader should not be visible
  expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
});

// Test: Should render the table with the correct number of rows
test('should render table rows with correct project data', async () => {
  render(<App />);
  
  // Wait for the table to render after data is fetched
  await waitFor(() => screen.getByText(/Kickstarter Projects/i));

  // Check that the table headers are present
  expect(screen.getByText(/S\.No\./i)).toBeInTheDocument();
  expect(screen.getByText(/Percentage Funded/i)).toBeInTheDocument();
  expect(screen.getByText(/Amount Pledged/i)).toBeInTheDocument();

  // Check that the first project is displayed
  expect(screen.getByText(/50/i)).toBeInTheDocument(); // Percentage Funded for the first project
  expect(screen.getByText(/5000/i)).toBeInTheDocument(); // Amount Pledged for the first project
});

// Test: Should update the page when pagination button is clicked
test('should paginate correctly when page number is clicked', async () => {
  render(<HighLightProjects />);
  
  // Wait for the table to render after data is fetched
  await waitFor(() => screen.getByText(/Kickstarter Projects/i));

  // Find the pagination buttons
  const paginationButtons = screen.getAllByRole('button');

  // Click the second pagination button (page 2)
  fireEvent.click(paginationButtons[1]);
  
  // Wait for the page to update
  await waitFor(() => expect(paginationButtons[1]).toHaveClass('active'));

  // Check if the table updates correctly (check for a project not on the first page)
  expect(screen.queryByText(/50/i)).not.toBeInTheDocument();  // First page should not show the first project
  expect(screen.getByText(/40/i)).toBeInTheDocument();  // Second page should show the 6th project
});

// Test: Should show the loader during page change
test('should show loader during page change', async () => {
  render(<HighLightProjects />);
  
  // Wait for initial data loading
  await waitFor(() => screen.getByText(/Kickstarter Projects/i));

  // Click a pagination button to change the page
  fireEvent.click(screen.getAllByRole('button')[1]);

  // The loader should be shown while the page is switching
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // Wait for the page to load and check if the loader disappears
  await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());
});
