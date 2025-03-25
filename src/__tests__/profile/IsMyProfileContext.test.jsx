import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { IsMyProfileProvider, useIsMyProfile } from '../../app/context/IsMyProfileContext';
import "@testing-library/jest-dom";

// Test component that uses the context
const TestConsumer = () => {
  const { isMyProfile, setIsMyProfile } = useIsMyProfile();
  
  return (
    <div>
      <div data-testid="profile-status">{isMyProfile ? 'My Profile' : 'Not My Profile'}</div>
      <button 
        data-testid="toggle-profile" 
        onClick={() => setIsMyProfile(!isMyProfile)}
      >
        Toggle
      </button>
    </div>
  );
};

describe('IsMyProfileContext', () => {
  test('should provide default value of false', () => {
    render(
      <IsMyProfileProvider>
        <TestConsumer />
      </IsMyProfileProvider>
    );
    
    expect(screen.getByTestId('profile-status')).toHaveTextContent('Not My Profile');
  });
  
  test('should update value when setIsMyProfile is called', () => {
    render(
      <IsMyProfileProvider>
        <TestConsumer />
      </IsMyProfileProvider>
    );
    
    // Initially false
    expect(screen.getByTestId('profile-status')).toHaveTextContent('Not My Profile');
    
    // Click to toggle
    act(() => {
      screen.getByTestId('toggle-profile').click();
    });
    
    // Now true
    expect(screen.getByTestId('profile-status')).toHaveTextContent('My Profile');
  });
  
  test('should maintain state across multiple consumers', () => {
    render(
      <IsMyProfileProvider>
        <TestConsumer />
        <TestConsumer />
      </IsMyProfileProvider>
    );
    
    // Both consumers should show 'Not My Profile' initially
    const statuses = screen.getAllByTestId('profile-status');
    expect(statuses[0]).toHaveTextContent('Not My Profile');
    expect(statuses[1]).toHaveTextContent('Not My Profile');
    
    // Click first consumer's toggle button
    act(() => {
      screen.getAllByTestId('toggle-profile')[0].click();
    });
    
    // Both should now show 'My Profile'
    expect(statuses[0]).toHaveTextContent('My Profile');
    expect(statuses[1]).toHaveTextContent('My Profile');
  });
  
  test('should throw error if useIsMyProfile is used outside provider', () => {
    // Suppress console.error during this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestConsumer />);
    }).toThrow();
    
    // Restore console.error
    console.error = originalError;
  });
});