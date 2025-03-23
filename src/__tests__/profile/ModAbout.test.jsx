import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ModAbout from '../../app/components/modules/profile/container/ModAbout';
import "@testing-library/jest-dom";
import useUpdateProfile from '../../app/hooks/useUpdateProfile';

// ModAbout.test.jsx

// Mock dependencies
jest.mock('../../app/components/ui/Dialog', () => ({ useRegularButton, buttonData, AlertContent }) => (
  <div data-testid="dialog-mock">
    <div data-testid="button-data">{buttonData}</div>
    <div data-testid="alert-content">{AlertContent}</div>
  </div>
));

jest.mock('../../app/components/modules/profile/presentation/ModAboutPresentation', () => ({ handleSubmit, handleAbout, error, about, isLoading }) => (
  <div data-testid="about-presentation-mock">
    <button data-testid="submit-btn" onClick={() => handleSubmit(about)}>Submit</button>
    <textarea 
      data-testid="about-textarea" 
      value={about} 
      onChange={(e) => handleAbout(e.target.value)}
    />
    {error && <div data-testid="error-message">{error}</div>}
    {isLoading && <div data-testid="loading-indicator">Loading...</div>}
  </div>
));

jest.mock('../../app/components/ui/AddButton', () => () => <button data-testid="add-button">Add</button>);
jest.mock('../../app/components/ui/EditButton', () => () => <button data-testid="edit-button">Edit</button>);

// Mock useUpdateProfile hook
jest.mock('../../app/hooks/useUpdateProfile');

describe('ModAbout', () => {
  let mutateMock;
  
  beforeEach(() => {
    mutateMock = jest.fn();
    useUpdateProfile.mockReturnValue({
      mutate: mutateMock,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call updateProfileMutation.mutate with add api when adding=true', () => {
    render(<ModAbout about="Initial about" adding={true} />);
    
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    expect(mutateMock).toHaveBeenCalledWith({
      api: 'add',
      method: 'PATCH',
      data: { about: 'Initial about' }
    });
  });

  test('should call updateProfileMutation.mutate with edit api when adding=false', () => {
    render(<ModAbout about="Initial about" adding={false} />);
    
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    expect(mutateMock).toHaveBeenCalledWith({
      api: 'edit',
      method: 'PATCH',
      data: { about: 'Initial about' }
    });
  });

  test('should update the about text and handle errors correctly', () => {
    render(<ModAbout about="Initial about" adding={false} />);
    
    const textarea = screen.getByTestId('about-textarea');
    
    // Test for text too long
    fireEvent.change(textarea, { target: { value: 'a'.repeat(1001) } });
    expect(screen.getByTestId('error-message').textContent).toBe('About is too long.');
    
    // Test for no change
    fireEvent.change(textarea, { target: { value: 'Initial about' } });
    expect(screen.getByTestId('error-message').textContent).toBe("About hasn't changed.");
    
    // Test for valid change
    fireEvent.change(textarea, { target: { value: 'Updated about' } });
    expect(screen.queryByTestId('error-message')).toBeNull();
    
    // Submit the form with valid data
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    expect(mutateMock).toHaveBeenCalledWith({
      api: 'edit',
      method: 'PATCH',
      data: { about: 'Updated about' }
    });
  });

  test('should render add button when adding=true', () => {
    render(<ModAbout about="" adding={true} />);
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  test('should render edit button when adding=false', () => {
    render(<ModAbout about="" adding={false} />);
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
  });

  test('should pass isLoading prop to presentation component', () => {
    useUpdateProfile.mockReturnValue({
      mutate: mutateMock,
      isLoading: true
    });
    
    render(<ModAbout about="" adding={false} />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});