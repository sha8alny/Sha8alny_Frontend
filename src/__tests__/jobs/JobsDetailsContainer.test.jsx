import React from 'react';
import { render, screen } from '@testing-library/react';
import JobDetailsContainer from '@/app/components/modules/jobs/container/JobsDetailsContainer';
import '@testing-library/jest-dom';
import useJobDetails from '@/hooks/useJobDetails';
import { normalizeJob } from '@/app/utils/normalizeJob';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../hooks/useJobDetails');
jest.mock('../../app/utils/normalizeJob');
// Mocking ThemeContext
jest.mock('../../app/context/ThemeContext', () => ({
  ThemeContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({ theme: 'light' }),
  },
  useTheme: jest.fn(() => ({ theme: 'light' })),
}));

describe('JobDetailsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders JobDetailsPresentation with loading state', () => {
    useJobDetails.mockReturnValue({ job: null, isLoading: true, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);
    expect(useJobDetails).toHaveBeenCalledTimes(1);
  });

  test('renders JobDetailsPresentation with error state', () => {
    const errorMsg = 'Failed to fetch job details';
    useJobDetails.mockReturnValue({ job: null, isLoading: false, isError: true, errorMessage: errorMsg });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test('renders JobDetailsPresentation with normalized job data', () => {
    const mockJob = { id: 1, title: 'Software Engineer' };
    const normalizedMockJob = { id: 1, title: 'Software Engineer', normalized: true };

    useJobDetails.mockReturnValue({ job: mockJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedMockJob);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText(normalizedMockJob.title)).toBeInTheDocument();
  });

  test('handles null job data when not loading and not error', () => {
    useJobDetails.mockReturnValue({ job: null, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.queryAllByText(/loading/i).length).toBe(0);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('handles simultaneous loading and error states', () => {
    useJobDetails.mockReturnValue({ job: null, isLoading: true, isError: true, errorMessage: 'Error while loading' });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/error while loading/i)).toBeInTheDocument();
  });

  test('renders correctly when job data is undefined', () => {
    useJobDetails.mockReturnValue({ job: undefined, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('renders correctly when normalizeJob returns null', () => {
    const mockJob = { id: 2, title: 'Frontend Developer' };
    useJobDetails.mockReturnValue({ job: mockJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(null);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.queryByText(mockJob.title)).not.toBeInTheDocument();
  });

  test('renders correctly when job data is empty object', () => {
    useJobDetails.mockReturnValue({ job: {}, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue({});

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
