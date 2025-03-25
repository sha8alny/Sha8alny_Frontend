import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModAbout from '../../app/components/modules/profile/container/ModAbout';
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a global variable for the mock implementation
let mockUpdateProfileImplementation = jest.fn(() => Promise.resolve({ success: true }));

// Mock the external service using the absolute path with @ symbol
jest.mock('../../app/services/updateProfile', () => ({
  updateProfile: (...args) => mockUpdateProfileImplementation(...args)
}));

// Create a wrapper that provides the QueryClient
const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      }
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ModAbout', () => {
  // Save original alert before tests
  const originalAlert = window.alert;
  
  beforeEach(() => {
    // Mock window.alert to prevent it from showing during tests
    window.alert = jest.fn();
    
    // Reset the mock implementation for each test
    mockUpdateProfileImplementation = jest.fn(() => Promise.resolve({ success: true }));
  });

  afterEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original alert after all tests
    window.alert = originalAlert;
  });

  test('should render add button when adding=true', async () => {
    renderWithQueryClient(<ModAbout about="" adding={true} />);
    
    // Look for Add button
    const addButton = await screen.findByRole('button');
    expect(addButton).toBeInTheDocument();
  });

  test('should render edit button when adding=false', async () => {
    renderWithQueryClient(<ModAbout about="" adding={false} />);
    
    // Look for Edit button
    const editButton = await screen.findByRole('button');
    expect(editButton).toBeInTheDocument();
  });

  test('should open dialog when button is clicked', async () => {
    renderWithQueryClient(<ModAbout about="Initial about" adding={false} />);
    
    // Find and click the button that opens the dialog
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    
    // Check if dialog content is now visible
    await waitFor(() => {
      const aboutHeading = screen.getByText('About');
      expect(aboutHeading).toBeInTheDocument();
    });
  });

  test('should handle text input in the textarea', async () => {
    renderWithQueryClient(<ModAbout about="Initial about" adding={false} />);
    
    // Open the dialog
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    
    // Find the textarea by its placeholder text
    const textarea = await screen.findByPlaceholderText('Write about yourself.');
    fireEvent.change(textarea, { target: { value: 'Updated about text' } });
    
    // Verify the textarea value changed
    expect(textarea).toHaveValue('Updated about text');
  });

  test('should show character count', async () => {
    renderWithQueryClient(<ModAbout about="Initial about" adding={false} />);
    
    // Open the dialog
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    
    // Find the character count span
    await waitFor(() => {
      const countSpan = screen.getByText('13', { exact: true });
      expect(countSpan).toBeInTheDocument();
      expect(screen.getByText('/1000')).toBeInTheDocument();
    });
    
    // Find the textarea and update its value
    const textarea = screen.getByPlaceholderText('Write about yourself.');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    // Check that character count updated
    await waitFor(() => {
      const countSpan = screen.getByText('8', { exact: true });
      expect(countSpan).toBeInTheDocument();
    });
  });

  test('should show error when text is too long', async () => {
    renderWithQueryClient(<ModAbout about="" adding={false} />);
    
    // Open the dialog
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    
    // Create a string longer than 1000 characters
    const longText = 'a'.repeat(1001);
    
    // Find the textarea and set a value that's too long
    const textarea = await screen.findByPlaceholderText('Write about yourself.');
    fireEvent.change(textarea, { target: { value: longText } });
    
    // Verify character count turns red
    await waitFor(() => {
      const countElement = screen.getByText('1001', { exact: true });
      expect(countElement).toHaveClass('text-red-500');
    });
    
    // Also verify the error message
    await waitFor(() => {
      expect(screen.getByText('About is too long.')).toBeInTheDocument();
    });
  });

  test('should submit about data when save button is clicked', async () => {
    // Set up a resolved promise
    mockUpdateProfileImplementation.mockImplementation(() => {
      return Promise.resolve({ success: true });
    });

    renderWithQueryClient(<ModAbout about="Initial about" adding={false} />);
    
    // Open the dialog
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    
    // Update text
    const textarea = await screen.findByPlaceholderText('Write about yourself.');
    fireEvent.change(textarea, { target: { value: 'New about text' } });
    
    // Click save button
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify the service was called with the right parameters
    await waitFor(() => {
      expect(mockUpdateProfileImplementation).toHaveBeenCalledWith(
        "edit", 
        { about: "New about text" }, 
        "PATCH"
      );
    });
    
    // For now, just verify the mutation was called - we can't easily test component unmounting
    // This test is passing if the mock was called correctly
    expect(mockUpdateProfileImplementation).toHaveBeenCalledTimes(1);
  });
});