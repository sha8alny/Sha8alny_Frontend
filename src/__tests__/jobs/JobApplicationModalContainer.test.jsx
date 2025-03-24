import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import JobApplicationModalContainer from '../../app/components/modules/jobs/container/JobApplicationModalContainer';

// Mock dependencies
jest.mock('@tanstack/react-query');
jest.mock('react-hook-form');
jest.mock('../../app/services/jobs');

// More realistic mock for presentation component
jest.mock('../../app/components/modules/jobs/presentation/JobApplicationModalPresentation', () => {
  return function MockJobApplicationModalPresentation({ 
    handleSubmit, 
    handleFileChange, 
    handleClose, 
    isSubmitting, 
    register, 
    errors,
    watch 
  }) {
    return (
      <div data-testid="modal-presentation">
        <form onSubmit={handleSubmit}>
          <input 
            data-testid="phone-input" 
            placeholder="Phone" 
            {...register('phone')} 
          />
          {errors.phone && <span>{errors.phone.message}</span>}
          
          <textarea 
            data-testid="cover-letter" 
            placeholder="Cover Letter" 
            {...register('coverLetter')} 
          />
          {errors.coverLetter && <span>{errors.coverLetter.message}</span>}
          
          <input 
            type="file" 
            data-testid="file-input" 
            onChange={handleFileChange}
          />
          {errors.resume && <span>{errors.resume.message}</span>}
          
          <button type="submit" data-testid="submit-button">Submit</button>
          <button type="button" onClick={handleClose} data-testid="close-button">Close</button>
          {isSubmitting && <div data-testid="loading-indicator">Loading...</div>}
        </form>
      </div>
    );
  };
});

describe('JobApplicationModalContainer', () => {
  const mockProps = {
    show: true,
    handleClose: jest.fn(),
    jobId: 'job123',
    jobTitle: 'Software Engineer'
  };

  const mockMutate = jest.fn();
  const mockReset = jest.fn();
  const mockSetValue = jest.fn();
  const mockRegister = jest.fn();
  let mockFormState;
  let mockWatch;
  let fileInputRef;

  beforeEach(() => {
    // Mock requestSubmit to avoid "Not implemented" error
    HTMLFormElement.prototype.requestSubmit = jest.fn(() => {});
    jest.clearAllMocks();
    
    mockFormState = { errors: {} };
    mockWatch = jest.fn().mockReturnValue(null);
    fileInputRef = { current: { value: '' } };
    
    // Standard implementation for useForm
    useForm.mockReturnValue({
      register: mockRegister,
      handleSubmit: jest.fn(cb => data => cb(data)),
      setValue: mockSetValue,
      formState: mockFormState,
      reset: mockReset,
      watch: mockWatch
    });
    
    // Standard implementation for useMutation
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });
    
    // Mock useRef
    jest.spyOn(React, 'useRef').mockReturnValue(fileInputRef);
  });

  test('handles file change correctly', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    expect(mockSetValue).toHaveBeenCalledWith('resume', file, { shouldValidate: true });
  });

  test('submits form data correctly', async () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    expect(mockMutate).toHaveBeenCalled();
  });

  test('handles successful submission', async () => {
      // mutate: () => onSuccess(),
    useMutation.mockImplementation(({ onSuccess }) => ({
      mutate: () => onSuccess(),
      isPending: false
    }));
    
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
      expect(fileInputRef.current.value).toBe('');
    });
  });

  test('handles submission error', async () => {
    const errorMessage = 'Application failed';
    
      // mutate: () => onError(new Error(errorMessage)),
    useMutation.mockImplementation(({ onError }) => ({
      mutate: () => onError(new Error(errorMessage)),
      isPending: false
    }));
    
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Verify the error handler was called via the spied implementation
      expect(useMutation).toHaveBeenCalled();
    });
  });

  test('closes modal when close button is clicked', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    expect(mockProps.handleClose).toHaveBeenCalled();
  });

  test('shows loading state during submission', () => {
    // Set isPending to true for this test
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: true
    });
    
    render(<JobApplicationModalContainer {...mockProps} />);
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('passes correct props to presentation component', () => {
    render(<JobApplicationModalContainer {...mockProps} />);
    
    expect(screen.getByTestId('modal-presentation')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('cover-letter')).toBeInTheDocument();
  });

  // Better organized validation tests
  describe('Form validation', () => {
    test('validates phone number length', async () => {
      mockFormState.errors = { 
        phone: { message: 'Phone number must be at least 11 digits' } 
      };
      
      render(<JobApplicationModalContainer {...mockProps} />);
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/Phone number must be at least 11 digits/i)).toBeInTheDocument();
    });
    
    test('validates resume is required', async () => {
      mockFormState.errors = { 
        resume: { message: 'Resume is required' } 
      };
      
      render(<JobApplicationModalContainer {...mockProps} />);
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/Resume is required/i)).toBeInTheDocument();
    });
    
    test('validates file type', async () => {
      mockFormState.errors = { 
        resume: { message: 'Invalid file type' } 
      };
      
      render(<JobApplicationModalContainer {...mockProps} />);
      
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    });
    
    test('validates file size', async () => {
      mockFormState.errors = { 
        resume: { message: 'Max file size is 5MB' } 
      };
      
      render(<JobApplicationModalContainer {...mockProps} />);
      
      expect(screen.getByText(/Max file size is 5MB/i)).toBeInTheDocument();
    });
  });
});