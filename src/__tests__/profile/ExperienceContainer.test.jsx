import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExperienceContainer from '../../app/components/modules/profile/container/ExperienceContainer';
import "@testing-library/jest-dom";
import { IsMyProfileProvider } from '../../app/context/IsMyProfileContext';

// We'll need some sample experience data to test with
const mockExperience = [
  { 
    id: 1, 
    title: 'Software Engineer', 
    company: 'Tech Co',
    employmentType: 'Full-time',
    location: 'New York',
    description: 'Developing web applications',
    skills: ['React', 'JavaScript'],
    image: null,
    startDate: { month: 'Jan', year: '2020' },
    endDate: { month: 'Dec', year: '2022' }
  },
  { 
    id: 2, 
    title: 'Senior Developer', 
    company: 'Code Inc',
    employmentType: 'Contract',
    location: 'Remote',
    description: 'Leading development team',
    skills: ['Node.js', 'TypeScript'],
    image: null,
    startDate: { month: 'Feb', year: '2023' },
    endDate: { month: 'Present', year: '' }
  }
];

// Wrapper component to provide context
const renderWithContext = (ui, { isMyProfile = false } = {}) => {
  return render(
    <IsMyProfileProvider value={{ isMyProfile, setIsMyProfile: jest.fn() }}>
      {ui}
    </IsMyProfileProvider>
  );
};

describe('ExperienceContainer', () => {
  test('should render Experience component with experience data', () => {
    renderWithContext(<ExperienceContainer experience={mockExperience} />);
    
    // Check for Experience component rendering
    expect(screen.getByText('Experience')).toBeInTheDocument();
    
    // Check if experience data is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Co')).toBeInTheDocument();
  });

  test('should toggle between showing all experiences and limited experiences', () => {
    // Create more than 3 experiences to test toggling
    const manyExperiences = [
      ...mockExperience,
      { 
        id: 3, 
        title: 'Junior Developer', 
        company: 'Startup Inc',
        employmentType: 'Full-time',
        location: 'San Francisco',
        description: 'Frontend development',
        skills: ['HTML', 'CSS'],
        image: null,
        startDate: { month: 'May', year: '2018' },
        endDate: { month: 'Dec', year: '2019' }
      },
      { 
        id: 4, 
        title: 'Intern', 
        company: 'Tech Giant',
        employmentType: 'Internship',
        location: 'Seattle',
        description: 'Learning the ropes',
        skills: ['Java', 'Spring'],
        image: null,
        startDate: { month: 'Jun', year: '2017' },
        endDate: { month: 'Sep', year: '2017' }
      }
    ];
    
    renderWithContext(<ExperienceContainer experience={manyExperiences} />);
    
    // Initially only 3 experiences should be visible
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
    expect(screen.queryByText('Intern')).not.toBeInTheDocument();
    
    // Show all experiences
    const showMoreButton = screen.getByText(/Show all 4 experiences/i);
    fireEvent.click(showMoreButton);
    
    // All experiences should now be visible
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
    expect(screen.getByText('Intern')).toBeInTheDocument();
    
    // Show less
    const showLessButton = screen.getByText('Show less');
    fireEvent.click(showLessButton);
    
    // Fourth experience should not be visible again
    expect(screen.queryByText('Intern')).not.toBeInTheDocument();
  });

  test('should handle empty experience array', () => {
    renderWithContext(<ExperienceContainer experience={[]} />);
    
    // The Experience component shouldn't render when experience is empty
    expect(screen.queryByText('Experience')).not.toBeInTheDocument();
  });

  test('should handle undefined experience prop', () => {
    renderWithContext(<ExperienceContainer />);
    
    // The Experience component shouldn't render when experience is undefined
    expect(screen.queryByText('Experience')).not.toBeInTheDocument();
  });
});