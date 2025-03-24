import React from 'react';
import { render, screen } from '@testing-library/react';
import JobDetailsContainer from '@/app/components/modules/jobs/container/JobsDetailsContainer';
import useJobDetails from '@/hooks/useJobDetails';
import { normalizeJob } from '@/app/utils/normalizeJob';

// Mock the hooks and utilities
jest.mock('../../hooks/useJobDetails');
jest.mock('../../app/utils/normalizeJob');
jest.mock('../../app/components/modules/jobs/presentation/JobDetailsPrenestation', () => {
  return function MockJobDetailsPresentation({ job, isLoading, isError, errorMessage }) {
    return (
      <div data-testid="job-details-presentation">
        <div data-testid="job-props">{JSON.stringify({ job, isLoading, isError, errorMessage })}</div>
      </div>
    );
  };
});

describe('JobDetailsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders JobDetailsPresentation with loading state', () => {
    useJobDetails.mockReturnValue({ job: null, isLoading: true, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.isLoading).toBe(true);
    expect(props.isError).toBe(false);
    expect(useJobDetails).toHaveBeenCalledTimes(1);
  });

  test('renders JobDetailsPresentation with error state', () => {
    const errorMsg = 'Failed to fetch job details';
    useJobDetails.mockReturnValue({ job: null, isLoading: false, isError: true, errorMessage: errorMsg });
    normalizeJob.mockReturnValue(null);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.isError).toBe(true);
    expect(props.errorMessage).toBe(errorMsg);
  });

  test('renders JobDetailsPresentation with normalized job data', () => {
    const mockJob = { id: 1, title: 'Software Engineer' };
    const normalizedMockJob = { id: 1, title: 'Software Engineer', normalized: true };
    
    useJobDetails.mockReturnValue({ job: mockJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedMockJob);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.job).toEqual(normalizedMockJob);
    expect(normalizeJob).toHaveBeenCalledWith(mockJob);
  });

  test('handles null job data when not loading and not error', () => {
    useJobDetails.mockReturnValue({ job: null, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.job).toBeNull();
    expect(props.isLoading).toBe(false);
    expect(props.isError).toBe(false);
  });

  test('handles empty job object', () => {
    const emptyJob = {};
    const normalizedEmptyJob = { normalized: true };
    
    useJobDetails.mockReturnValue({ job: emptyJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedEmptyJob);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.job).toEqual(normalizedEmptyJob);
    expect(normalizeJob).toHaveBeenCalledWith(emptyJob);
  });

  test('handles job with all required fields', () => {
    const completeJob = {
      id: 123,
      title: 'Senior Developer',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'Job description here',
      requirements: ['JavaScript', 'React'],
      salary: '$100k - $130k'
    };
    
    const normalizedCompleteJob = { ...completeJob, normalized: true };
    
    useJobDetails.mockReturnValue({ job: completeJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedCompleteJob);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.job).toEqual(normalizedCompleteJob);
    expect(normalizeJob).toHaveBeenCalledWith(completeJob);
  });

  test('handles simultaneous loading and error states', () => {
    // This is an edge case but might happen in real scenarios
    useJobDetails.mockReturnValue({ job: null, isLoading: true, isError: true, errorMessage: 'Error while loading' });
    normalizeJob.mockReturnValue(null);
    
    render(<JobDetailsContainer />);
    
    const props = JSON.parse(screen.getByTestId('job-props').textContent);
    expect(props.isLoading).toBe(true);
    expect(props.isError).toBe(true);
    expect(props.errorMessage).toBe('Error while loading');
  });
});