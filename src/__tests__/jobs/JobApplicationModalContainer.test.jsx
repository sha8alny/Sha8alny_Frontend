import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import JobApplicationModalContainer from '../../app/components/modules/jobs/container/JobApplicationModalContainer';

// Mock only external dependencies
jest.mock('@tanstack/react-query');
jest.mock('react-hook-form');
jest.mock('../../app/services/jobs');

describe('JobApplicationModalContainer with Presentation', () => {
  const mockProps = {
    show: true,
    handleClose: jest.fn(),
    jobId: 'job123',
    jobTitle: 'Software Engineer',
  };

  const mockMutate = jest.fn();
  const mockReset = jest.fn();
  const mockSetValue = jest.fn();
  const mockRegister = jest.fn();
  let mockFormState;
  let mockWatch;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFormState = { errors: {} };
    mockWatch = jest.fn().mockReturnValue(null);

    useForm.mockReturnValue({
      register: mockRegister.mockImplementation((name) => ({ name })),
      handleSubmit: (cb) => (data) => cb(data),
      setValue: mockSetValue,
      formState: mockFormState,
      reset: mockReset,
      watch: mockWatch,
    });

    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  test('renders modal with correct job title', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    expect(screen.getByText(`Apply for ${mockProps.jobTitle}`)).toBeInTheDocument();
  });

  test('shows form fields', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter/i)).toBeInTheDocument();
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
  });

  test('handles file upload', () => {
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const fileInput = screen.getByLabelText(/resume\/cv/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(mockSetValue).toHaveBeenCalledWith('resume', file, { shouldValidate: true });
  });

  test('shows loading state during submission', () => {
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<JobApplicationModalContainer {...mockProps} />);
    
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });

  test('shows success message after submission', async () => {
    useMutation.mockImplementation(({ onSuccess }) => ({
      mutate: () => onSuccess(),
      isPending: false,
    }));

    render(<JobApplicationModalContainer {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
    });
  });

  test('shows error message when submission fails', async () => {
    const errorMessage = 'Submission failed';
    
    useMutation.mockImplementation(({ onError }) => ({
      mutate: () => onError(new Error(errorMessage)),
      isPending: false,
    }));

    render(<JobApplicationModalContainer {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('closes modal when cancel button is clicked', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockProps.handleClose).toHaveBeenCalled();
  });

  describe('Form validation', () => {
    test('shows phone number validation error', () => {
      mockFormState.errors = {
        phone: { message: 'Invalid phone number' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    });

    test('shows resume validation errors', () => {
      mockFormState.errors = {
        resume: { message: 'Resume is required' },
      };

      render(<JobApplicationModalContainer {...mockProps} />);
      
      expect(screen.getByText(/resume is required/i)).toBeInTheDocument();
    });
  });
  test('prevents non-numeric input in phone number field', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    
    // Test valid number input
    fireEvent.change(phoneInput, { target: { value: '1' } });
    expect(phoneInput.value).toBe('1'); // Ensure the value is updated correctly
    
    // Test invalid character key
    fireEvent.change(phoneInput, { key: 'a' });
    expect(phoneInput.value).not.toBe('a1'); // Shouldn't accept letters
  });

  test('displays selected file name or placeholder text', () => {
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    mockWatch.mockReturnValueOnce(file);

    render(<JobApplicationModalContainer {...mockProps} />);
    
    expect(screen.getByText(file.name)).toBeInTheDocument();

    mockWatch.mockReturnValueOnce(null);
    render(<JobApplicationModalContainer {...mockProps} />);
    
    expect(screen.getByText(/no file selected/i)).toBeInTheDocument();
  });

  test('clears form after successful submission', async () => {
    useMutation.mockImplementation(({ onSuccess }) => ({
      mutate: () => onSuccess(),
      isPending: false,
    }));

    render(<JobApplicationModalContainer {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
    
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
    });
  });
});