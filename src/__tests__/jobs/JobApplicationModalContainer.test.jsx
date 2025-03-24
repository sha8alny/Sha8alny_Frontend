import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import JobApplicationModalContainer from '../../app/components/modules/jobs/container/JobApplicationModalContainer';

// Mocking dependencies
jest.mock('@tanstack/react-query');
jest.mock('react-hook-form');
jest.mock('../../app/services/jobs');

// Mocking ThemeContext
jest.mock('../../app/context/ThemeContext', () => ({
  ThemeContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({ theme: 'light' }),
  },
  useTheme: jest.fn(() => ({ theme: 'light' })),
}));

describe('JobApplicationModalContainer', () => {
  // Mock props for the component
  const mockProps = {
    show: true,
    handleClose: jest.fn(),
    jobId: 'job123',
    jobTitle: 'Software Engineer',
  };

  // Mock functions and variables
  const mockMutate = jest.fn();
  const mockReset = jest.fn();
  const mockSetValue = jest.fn();
  const mockRegister = jest.fn();
  let mockFormState;
  let mockWatch;
  let fileInputRef;

  beforeEach(() => {
    // Mocking form submission behavior
    HTMLFormElement.prototype.requestSubmit = jest.fn(() => {});
    jest.clearAllMocks();

    // Initializing mock form state and watch
    mockFormState = { errors: {} };
    mockWatch = jest.fn().mockReturnValue(null);
    fileInputRef = { current: { value: '' } };

    // Mocking useForm hook
    useForm.mockReturnValue({
      register: mockRegister,
      handleSubmit: jest.fn((cb) => (data) => cb(data)),
      setValue: mockSetValue,
      formState: mockFormState,
      reset: mockReset,
      watch: mockWatch,
    });

    // Mocking useMutation hook
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    // Mocking useRef
    jest.spyOn(React, 'useRef').mockReturnValue(fileInputRef);
  });

  test('handles file change correctly', () => {
    // Test file input change behavior
    render(<JobApplicationModalContainer {...mockProps} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/upload resume/i);

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    fireEvent.change(fileInput);

    // Expect setValue to be called with the correct arguments
    expect(mockSetValue).toHaveBeenCalledWith('resume', file, { shouldValidate: true });
  });

  test('submits form data correctly', async () => {
    // Test form submission behavior
    render(<JobApplicationModalContainer {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    fireEvent.click(submitButton);

    // Expect mutate to be called
    expect(mockMutate).toHaveBeenCalled();
  });

  test('handles successful submission', async () => {
    // Mock successful mutation behavior
    useMutation.mockImplementation(({ onSuccess }) => ({
      mutate: () => onSuccess(),
      isPending: false,
    }));

    render(<JobApplicationModalContainer {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    fireEvent.click(submitButton);

    // Wait for reset and file input value clearing
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
      expect(fileInputRef.current.value).toBe('');
    });
  });

  test('handles submission error', async () => {
    const errorMessage = 'Application failed';

    // Mock mutation behavior with error handling
    useMutation.mockImplementation(({ onError }) => ({
      mutate: mockMutate.mockImplementation((data, options = {}) => {
        if (options.onError) options.onError(new Error(errorMessage));
        onError(new Error(errorMessage));
      }),
      isPending: false,
    }));

    render(<JobApplicationModalContainer {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    fireEvent.click(submitButton);

    // Wait for mutate to be called
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  test('closes modal when close button is clicked', () => {
    // Test modal close behavior
    render(<JobApplicationModalContainer {...mockProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Expect handleClose to be called
    expect(mockProps.handleClose).toHaveBeenCalled();
  });

  test('shows loading state during submission', () => {
    // Mock loading state during mutation
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<JobApplicationModalContainer {...mockProps} />);

    // Expect loading indicator to be displayed
    const loadingIndicator = screen.getByText(/submitting/i);
    expect(loadingIndicator).toBeInTheDocument();
  });

  describe('Form validation', () => {
    test('validates phone number length', async () => {
      // Mock validation error for phone number
      mockFormState.errors = {
        phone: { message: 'Phone number must be at least 11 digits' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      const errorMessage = screen.queryByText(/phone number must be at least 11 digits/i);

      // Expect validation error message to be displayed
      expect(errorMessage).toBeInTheDocument();
    });

    test('validates resume is required', async () => {
      // Mock validation error for missing resume
      mockFormState.errors = {
        resume: { message: 'Resume is required' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      const errorMessage = screen.queryByText(/resume is required/i);

      // Expect validation error message to be displayed
      expect(errorMessage).toBeInTheDocument();
    });

    test('validates file type', async () => {
      // Mock validation error for invalid file type
      mockFormState.errors = {
        resume: { message: 'Invalid file type' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      const errorMessage = screen.queryByText(/invalid file type/i);

      // Expect validation error message to be displayed
      expect(errorMessage).toBeInTheDocument();
    });

    test('validates file size', async () => {
      // Mock validation error for file size
      mockFormState.errors = {
        resume: { message: 'Max file size is 5MB' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      const errorMessage = screen.queryByText(/max file size is 5mb/i);

      // Expect validation error message to be displayed
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
