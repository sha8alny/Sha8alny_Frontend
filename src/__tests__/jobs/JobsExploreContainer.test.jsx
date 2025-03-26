import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobsExploreContainer from '@/app/components/modules/jobs/container/JobsExploreContainer';
import useJobListings from '@/app/hooks/useJobListings';
import { useRouter } from 'next/navigation';

jest.mock('../../app/hooks/useJobDetails');
jest.mock('../../app/hooks/useJobListings', () => jest.fn());
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../app/utils/normalizeJob', () => ({
  normalizeJob: jest.fn(data => data),
}));

describe('JobsExploreContainer', () => {
  const mockRouter = { push: jest.fn() };
  const mockJobData = {
    pages: [
      {
        data: [
          { 
            id: '1', 
            title: 'Software Engineer', 
            company: { name: 'Tech Co', logo: '/logo1.png' },
            employmentType: 'Full-time',
            workLocation: 'Remote',
            description: 'A great job opportunity',
            createdAt: new Date(Date.now() - 8640500), // 1 day ago
            salary: '100000'
          },
          { 
            id: '2', 
            title: 'Product Manager', 
            company: { name: 'Dev Inc' },
            location: 'New York',
            employmentType: 'Part-time',
            description: 'Product management role',
            createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useJobListings.mockReturnValue({
      data: mockJobData,
      error: null,
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders JobsExplorePresentation with correct props', () => {
    render(<JobsExploreContainer />);
    expect(screen.getByRole('heading', { name: /explore/i })).toBeInTheDocument();
  });

  test('passes job data to presentation component', () => {
    render(<JobsExploreContainer />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  test('calls fetchNextPage when load more is clicked', () => {
    const mockFetchNextPage = jest.fn();
    useJobListings.mockReturnValue({
      data: mockJobData,
      error: null,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(<JobsExploreContainer />);
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  test('navigates to job details page when a job is clicked', () => {
    render(<JobsExploreContainer />);
    fireEvent.click(screen.getByText('Software Engineer').closest('div'));
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/jobs/1?title=Software%20Engineer&company=Tech%20Co'
    );
  });

  test('displays loading state', () => {
    useJobListings.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    
    render(<JobsExploreContainer />);
    expect(screen.getByText('Loading job listings...')).toBeInTheDocument();
  });

  test('handles errors correctly', () => {
    useJobListings.mockReturnValue({
      data: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    
    render(<JobsExploreContainer />);
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
  
  // New test cases focusing on JobTag, JobCard, and JobsCard components
  
  test('renders job tags correctly', () => {
    render(<JobsExploreContainer />);
    
    // Check that employment type tags are displayed
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Part-time')).toBeInTheDocument();
    
    // Check that work location tags are displayed
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
  
  test('displays correct relative time for job postings', () => {
    render(<JobsExploreContainer />);
    
    // The first job was created 1 day ago
    expect(screen.getByText('Posted Yesterday')).toBeInTheDocument();
    
    // The second job was created 7 days ago
    expect(screen.getByText('Posted 1 weeks ago')).toBeInTheDocument();
  });
  
  test('displays salary information when available', () => {
    render(<JobsExploreContainer />);
    
    // Check that salary is displayed for the first job
    expect(screen.getByText('Salary: 100000 $')).toBeInTheDocument();
    
    // Check that "undisclosed" is displayed for the second job
    expect(screen.getByText('Salary: undisclosed')).toBeInTheDocument();
  });
  
  test('displays job descriptions', () => {
    render(<JobsExploreContainer />);
    
    // Check that job descriptions are displayed
    expect(screen.getByText('A great job opportunity')).toBeInTheDocument();
    expect(screen.getByText('Product management role')).toBeInTheDocument();
  });
  
  test('displays company information', () => {
    render(<JobsExploreContainer />);
    
    // Check that company names are displayed along with location
    expect(screen.getByText(/Tech Co/)).toBeInTheDocument();
    expect(screen.getByText(/Dev Inc/)).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
  });
  
  test('shows "No job listings" message when no jobs are available', () => {
    useJobListings.mockReturnValue({
      data: { pages: [{ data: [] }] },
      error: null,
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    
    render(<JobsExploreContainer />);
    expect(screen.getByText('No job listings available at the moment.')).toBeInTheDocument();
  });
  
  test('handles null date correctly in getRelativeTimeString', () => {
    const jobWithNoDate = {
      pages: [
        {
          data: [
            { 
              id: '3', 
              title: 'Designer', 
              company: { name: 'Art Co' },
              createdAt: null
            }
          ]
        }
      ]
    };
    
    useJobListings.mockReturnValue({
      data: jobWithNoDate,
      error: null,
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    
    render(<JobsExploreContainer />);
    expect(screen.getByText('Posted Recently')).toBeInTheDocument();
  });

  test('correctly transforms API job data through normalizeJob', () => {
    const mockRawData = {
      pages: [
        {
          data: [
            { 
              _id: '5', 
              title: 'Backend Developer', 
              companyData: { 
                id: 'comp1', 
                name: 'API Solutions', 
                username: 'apisol',
                logo: '/logo5.png',
                location: 'Berlin'
              },
              company: { name: 'API Solutions', logo: '/logo5.png' },
              workLocation: 'Hybrid',
              employmentType: 'Contract',
              description: 'Backend role with Node.js',
              industry: 'Technology',
              experience: '3-5 years',
              salary: 85000,
              isSavedByUser: true,
              createdAt: '2023-04-15T10:30:00Z',
              updatedAt: '2023-04-16T14:20:00Z'
            }
          ]
        }
      ]
    };
    
    useJobListings.mockReturnValue({
      data: mockRawData,
      error: null,
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    
    render(<JobsExploreContainer />);
    
    // Verify normalized data is displayed correctly
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText(/API Solutions/)).toBeInTheDocument();
    expect(screen.getByText('Hybrid')).toBeInTheDocument();
    expect(screen.getByText('Contract')).toBeInTheDocument();
    expect(screen.getByText('Backend role with Node.js')).toBeInTheDocument();
    expect(screen.getByText('Salary: 85000 $')).toBeInTheDocument();
  });
});