import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModAbout from '../../app/components/modules/profile/container/ModAbout';
import "@testing-library/jest-dom";
import useUpdateProfile from '../../app/hooks/useUpdateProfile';

// Mock dependencies
jest.mock('../../app/components/ui/Dialog', () => ({ useRegularButton, buttonData, AlertContent }) => (
  <div data-testid="dialog-mock">
    <div data-testid="button-data">{buttonData}</div>
    <div data-testid="alert-content">{AlertContent}</div>
  </div>
));

// Mock with a more realistic implementation
jest.mock('../../app/components/ui/DialogMod', () => ({ useRegularButton, buttonData, AlertContent }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div data-testid="dialog-mock">
      <button 
        data-testid="dialog-trigger" 
        onClick={() => setIsOpen(true)}
      >
        {buttonData}
      </button>
      {isOpen && (
        <div data-testid="dialog-content">
          {AlertContent}
        </div>
      )}
    </div>
  );
});

jest.mock('../../app/components/modules/profile/presentation/ModAboutPresentation', () => {
  return function MockModAboutPresentation({ handleSubmit, handleAbout, error, about, isLoading }) {
    return (
      <div data-testid="about-presentation-mock">
        <textarea 
          data-testid="about-textarea" 
          value={about || ""} 
          onChange={(e) => handleAbout(e.target.value)}
        />
        {error && <div data-testid="error-message">{error}</div>}
        <button 
          data-testid="submit-btn" 
          onClick={() => handleSubmit(about)}
          disabled={isLoading}
        >
          Submit
        </button>
        {isLoading && <div data-testid="loading-indicator">Loading...</div>}
      </div>
    );
  };
});

jest.mock('../../app/components/ui/AddButton', () => () => <span data-testid="add-button">Add</span>);
jest.mock('../../app/components/ui/EditButton', () => () => <span data-testid="edit-button">Edit</span>);

// Mock useUpdateProfile hook
jest.mock('../../app/hooks/useUpdateProfile');

// Mock window.alert
const originalAlert = window.alert;
window.alert = jest.fn();

describe('ModAbout', () => {
  let mutateMock;
  
  beforeEach(() => {
    mutateMock = jest.fn();
    useUpdateProfile.mockReturnValue({
      mutate: mutateMock,
      isLoading: false,
      isError: false,
      isSuccess: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  test('should call updateProfileMutation.mutate with correct api based on adding prop', () => {
    render(<ModAbout about="Initial about" adding={true} />);
    
    // First open the dialog
    const dialogTrigger = screen.getByTestId('dialog-trigger');
    fireEvent.click(dialogTrigger);
    
    // Now we can access the dialog content
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    expect(mutateMock).toHaveBeenCalledWith({
      api: 'edit',  // Both adding=true and adding=false use the 'edit' API
      method: 'PATCH',
      data: { about: 'Initial about' }
    });
  });

  test('should call updateProfileMutation.mutate with edit api when adding=false', () => {
    render(<ModAbout about="Initial about" adding={false} />);
    
    // First open the dialog
    const dialogTrigger = screen.getByTestId('dialog-trigger');
    fireEvent.click(dialogTrigger);
    
    // Now we can access the dialog content
    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    
    expect(mutateMock).toHaveBeenCalledWith({
      api: 'edit',
      method: 'PATCH',
      data: { about: 'Initial about' }
    });
  });

  test('should handle valid input change', () => {
    render(<ModAbout about="Initial about" adding={false} />);
    
    // First open the dialog
    const dialogTrigger = screen.getByTestId('dialog-trigger');
    fireEvent.click(dialogTrigger);
    
    // Now we can access the dialog content
    const textarea = screen.getByTestId('about-textarea');
    
    // Change to valid new value
    fireEvent.change(textarea, { target: { value: 'Updated about' } });
    
    // Submit should work
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

  test('should show loading indicator when isLoading is true', () => {
    useUpdateProfile.mockReturnValue({
      mutate: mutateMock,
      isLoading: true,
      isError: false,
      isSuccess: false
    });
    
    render(<ModAbout about="" adding={false} />);
    
    // First open the dialog
    const dialogTrigger = screen.getByTestId('dialog-trigger');
    fireEvent.click(dialogTrigger);
    
    // Now we can check for the loading indicator inside the open dialog
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});