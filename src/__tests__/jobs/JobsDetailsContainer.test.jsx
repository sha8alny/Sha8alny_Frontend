import React from 'react';
import { render, screen } from '@testing-library/react';
import JobDetailsContainer from '@/app/components/modules/jobs/container/JobsDetailsContainer';
import '@testing-library/jest-dom';
import useJobDetails from '@/app/hooks/useJobDetails';
import { normalizeJob } from '@/app/utils/normalizeJob';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../app/hooks/useJobDetails');
jest.mock('../../app/utils/normalizeJob');

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

  test('renders job description when available', () => {
    const mockJob = { 
      id: 3, 
      title: 'Data Scientist', 
      description: 'Analyze complex data sets'
    };
    const normalizedMockJob = { 
      id: 3, 
      title: 'Data Scientist', 
      description: 'Analyze complex data sets' 
    };

    useJobDetails.mockReturnValue({ job: mockJob, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedMockJob);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Analyze complex data sets')).toBeInTheDocument();
  });

  test('renders job tags correctly with all information', () => {
    const normalizedMockJob = { 
      id: 4, 
      title: 'Senior Developer', 
      employmentType: 'Full-time',
      salary : 120000,
      salaryFormatted: 120000,
      createdAt: new Date('2023-05-15'),
      workLocation: 'Remote'
    };

    useJobDetails.mockReturnValue({ 
      job: {}, 
      isLoading: false, 
      isError: false, 
      errorMessage: null 
    });
    normalizeJob.mockReturnValue(normalizedMockJob);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('120000')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText(/Posted:/)).toBeInTheDocument();
  });

  test('renders job requirements section correctly', () => {
    const normalizedMockJob = { 
      id: 5, 
      title: 'Product Manager', 
      experience: '5+ years',
      industry: 'Technology',
      location: 'New York'
    };

    useJobDetails.mockReturnValue({ job: {}, isLoading: false, isError: false, errorMessage: null });
    normalizeJob.mockReturnValue(normalizedMockJob);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <JobDetailsContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText(/Experience: 5\+ years/)).toBeInTheDocument();
    expect(screen.getByText(/Industry: Technology/)).toBeInTheDocument();
    expect(screen.getByText(/Location: New York/)).toBeInTheDocument();
  });

});
