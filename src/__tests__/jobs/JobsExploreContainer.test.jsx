import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobsExploreContainer from '@/app/components/modules/jobs/container/JobsExploreContainer';
import useJobListings from '@/hooks/useJobListings';
import { useRouter } from 'next/navigation';

// Mock the required hooks and utils
jest.mock('../../hooks/useJobDetails');
jest.mock('../../hooks/useJobListings', () => jest.fn());
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../app/utils/normalizeJob', () => ({
  normalizeJob: jest.fn(data => data),
}));
jest.mock('../../app/components/modules/jobs/presentation/JobsExplorePresentation', () => {
  return function MockedPresentation(props) {
    return (
      <div data-testid="jobs-presentation">
        <button data-testid="load-more" onClick={props.fetchNextPage}>Load More</button>
        {props.data?.map(job => (
          <div key={job.id} data-testid={`job-${job.id}`} onClick={() => props.handleJobClick(job)}>
            {job.title}
          </div>
        ))}
      </div>
    );
  };
});

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
    render(<JobsExploreContainer />);
    expect(screen.getByTestId('jobs-presentation')).toBeInTheDocument();
  });

  test('passes job data to presentation component', () => {
    render(<JobsExploreContainer />);
    expect(screen.getByTestId('job-1')).toBeInTheDocument();
    expect(screen.getByTestId('job-2')).toBeInTheDocument();
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
    fireEvent.click(screen.getByTestId('load-more'));
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  test('navigates to job details page when a job is clicked', () => {
    render(<JobsExploreContainer />);
    fireEvent.click(screen.getByTestId('job-1'));
    
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
    expect(screen.getByTestId('jobs-presentation')).toBeInTheDocument();
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
    expect(screen.getByTestId('jobs-presentation')).toBeInTheDocument();
  });
});