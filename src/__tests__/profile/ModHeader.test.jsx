import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModHeader from '@/app/components/modules/profile/container/ModHeader';
import { useIsMyProfile } from '@/app/context/IsMyProfileContext';

// Mock the IsMyProfileContext hook
jest.mock('../../app/context/IsMyProfileContext', () => ({
  useIsMyProfile: jest.fn()
}));

// Mock the service modules
jest.mock('../../app/services/connectUser', () => ({
  connectUser: jest.fn(() => Promise.resolve())
}));

jest.mock('../../app/services/userProfile', () => ({
  fetchUserProfile: jest.fn(() => Promise.resolve({}))
}));

// Import the mocked modules after mocking them
import { connectUser } from '@/app/services/connectUser';
import { fetchUserProfile } from '@/app/services/userProfile';

// Mock console.log
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('ModHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Restore console.log
    console.log = originalConsoleLog;
  });
  
  test('should render edit profile button when viewing own profile', () => {
    // Mock the hook to return isMyProfile as true
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    
    render(<ModHeader />);
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.queryByText('Download Resume')).not.toBeInTheDocument();
    expect(screen.queryByText('Connect')).not.toBeInTheDocument();
  });
  
  test('should render connect and download resume buttons when viewing another profile', () => {
    // Mock the hook to return isMyProfile as false
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    render(<ModHeader />);
    
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });
  
  test('should call connectUser and fetchUserProfile when connect button is clicked', () => {
    // Mock the hook to return isMyProfile as false
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    render(<ModHeader />);
    fireEvent.click(screen.getByText('Connect'));
    
    expect(connectUser).toHaveBeenCalled();
    expect(fetchUserProfile).toHaveBeenCalled();
  });
  
  test('should log to console when download resume button is clicked', () => {
    // Mock the hook to return isMyProfile as false
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    render(<ModHeader />);
    fireEvent.click(screen.getByText('Download Resume'));
    
    expect(console.log).toHaveBeenCalledWith('Download Resume');
  });
  
  test('should correctly handle multiple connect clicks', () => {
    // Mock the hook to return isMyProfile as false
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    render(<ModHeader />);
    fireEvent.click(screen.getByText('Connect'));
    fireEvent.click(screen.getByText('Connect'));
    
    expect(connectUser).toHaveBeenCalledTimes(2);
    expect(fetchUserProfile).toHaveBeenCalledTimes(2);
  });
});