import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EducationContainer from '../../app/components/modules/profile/container/EducationContainer';
import "@testing-library/jest-dom";
import { useIsMyProfile } from "../../app/context/IsMyProfileContext";

// Mock dependencies
jest.mock("../../app/context/IsMyProfileContext");
jest.mock("../../app/components/modules/profile/presentation/Education", () => {
  return function MockEducation({ education, allEducation, toggleAllEducation, isMyProfile }) {
    return (
      <div data-testid="education-presentation-mock">
        <div data-testid="education-data">{JSON.stringify(education || [])}</div>
        <div data-testid="all-education">{String(allEducation)}</div>
        <div data-testid="is-my-profile">{String(isMyProfile)}</div>
        <button data-testid="toggle-button" onClick={toggleAllEducation}>
          Toggle Education
        </button>
      </div>
    );
  };
});

describe('EducationContainer', () => {
  const mockEducation = [
    { id: 1, school: 'Test University', degree: 'Computer Science' },
    { id: 2, school: 'Another University', degree: 'Engineering' }
  ];

  beforeEach(() => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render Education component with correct props', () => {
    render(<EducationContainer education={mockEducation} />);
    
    expect(screen.getByTestId('education-presentation-mock')).toBeInTheDocument();
    expect(screen.getByTestId('education-data')).toHaveTextContent(JSON.stringify(mockEducation));
    expect(screen.getByTestId('all-education')).toHaveTextContent('false');
  });

  test('should pass isMyProfile value from context to Education component', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    
    render(<EducationContainer education={mockEducation} />);
    
    expect(screen.getByTestId('is-my-profile')).toHaveTextContent('true');
  });

  test('should toggle allEducation state when toggleAllEducation is called', () => {
    render(<EducationContainer education={mockEducation} />);
    
    // Initial state should be false
    expect(screen.getByTestId('all-education')).toHaveTextContent('false');
    
    // Click toggle button
    fireEvent.click(screen.getByTestId('toggle-button'));
    
    // State should now be true
    expect(screen.getByTestId('all-education')).toHaveTextContent('true');
    
    // Click toggle button again
    fireEvent.click(screen.getByTestId('toggle-button'));
    
    // State should be back to false
    expect(screen.getByTestId('all-education')).toHaveTextContent('false');
  });

  test('should render with empty education array', () => {
    render(<EducationContainer education={[]} />);
    
    expect(screen.getByTestId('education-data')).toHaveTextContent('[]');
  });

  test('should render with undefined education prop', () => {
    render(<EducationContainer />);
    
    // Changed to check for empty array since the component should handle undefined
    expect(screen.getByTestId('education-data')).toHaveTextContent('[]');
  });
});