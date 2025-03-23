import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificationsContainer from '../../app/components/modules/profile/container/CertificationsContainer';
import "@testing-library/jest-dom";
import { useIsMyProfile } from "../../app/context/IsMyProfileContext";

// Mock dependencies
jest.mock("../../app/context/IsMyProfileContext");
jest.mock('../../app/components/modules/profile/presentation/Certifications', () => ({ 
  certifications, 
  allCertificates, 
  toggleAllCertificates,
  isMyProfile 
}) => (
  <div data-testid="certifications-mock">
    <div data-testid="certifications-data">{JSON.stringify(certifications)}</div>
    <div data-testid="all-certificates">{String(allCertificates)}</div>
    <div data-testid="is-my-profile">{String(isMyProfile)}</div>
    <button data-testid="toggle-button" onClick={toggleAllCertificates}>Toggle</button>
  </div>
));

describe('CertificationsContainer', () => {
  const mockCertifications = [
    { id: 1, name: 'AWS Certified Developer' },
    { id: 2, name: 'Azure Fundamentals' }
  ];

  beforeEach(() => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render Certifications component with correct props', () => {
    render(<CertificationsContainer certifications={mockCertifications} />);
    
    // Check if certifications are passed correctly
    expect(JSON.parse(screen.getByTestId('certifications-data').textContent))
      .toEqual(mockCertifications);
    
    // Check initial allCertificates state is false
    expect(screen.getByTestId('all-certificates').textContent).toBe('false');
    
    // Check isMyProfile is passed correctly
    expect(screen.getByTestId('is-my-profile').textContent).toBe('false');
  });

  test('should toggle allCertificates state when toggle function is called', () => {
    render(<CertificationsContainer certifications={mockCertifications} />);
    
    // Initial state should be false
    expect(screen.getByTestId('all-certificates').textContent).toBe('false');
    
    // Click toggle button
    fireEvent.click(screen.getByTestId('toggle-button'));
    
    // State should now be true
    expect(screen.getByTestId('all-certificates').textContent).toBe('true');
    
    // Click toggle button again
    fireEvent.click(screen.getByTestId('toggle-button'));
    
    // State should be back to false
    expect(screen.getByTestId('all-certificates').textContent).toBe('false');
  });

  test('should pass isMyProfile value from context', () => {
    // Mock the context to return true
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    
    render(<CertificationsContainer certifications={mockCertifications} />);
    
    // Check isMyProfile is passed correctly as true
    expect(screen.getByTestId('is-my-profile').textContent).toBe('true');
  });

  test('should handle empty certifications array', () => {
    render(<CertificationsContainer certifications={[]} />);
    
    // Check if empty array is passed correctly
    expect(JSON.parse(screen.getByTestId('certifications-data').textContent))
      .toEqual([]);
  });
});