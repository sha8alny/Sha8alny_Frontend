import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobsExploreContainer from '@/app/components/modules/jobs/container/JobsExploreContainer';
import useJobListings from '@/hooks/useJobListings';
import { useRouter } from 'next/navigation';

jest.mock('../../hooks/useJobDetails');
jest.mock('../../hooks/useJobListings', () => jest.fn());
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
          { id: '1', title: 'Software Engineer', company: { name: 'Tech Co' } },
          { id: '2', title: 'Product Manager', company: { name: 'Dev Inc' } }
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
    // Render the container and verify that the presentation component is rendered with the correct heading
    render(<JobsExploreContainer />);
    expect(screen.getByRole('heading', { name: /explore/i })).toBeInTheDocument();
  });

  test('passes job data to presentation component', () => {
    // Render the container and verify that job data is displayed in the presentation component
    render(<JobsExploreContainer />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  test('calls fetchNextPage when load more is clicked', () => {
    // Mock the fetchNextPage function and verify it is called when the "Load More" button is clicked
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
    // Simulate clicking on a job and verify that the router navigates to the correct job details page
    render(<JobsExploreContainer />);
    fireEvent.click(screen.getByText('Software Engineer').closest('div'));
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/jobs/1?title=Software%20Engineer&company=Tech%20Co'
    );
  });

  test('displays loading state', () => {
    // Mock the loading state and verify that the loading message is displayed
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
    // Mock an error state and verify that the error message is displayed
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
});