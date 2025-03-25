import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchJobDetails } from '../../app/services/jobs';
import { useSearchParams, useParams } from 'next/navigation';
import useJobDetails from '../../app/hooks/useJobDetails';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

// Mock the jobs service
jest.mock('../../app/services/jobs', () => ({
  fetchJobDetails: jest.fn(),
}));

// Import the mocked modules

describe('useJobDetails hook', () => {
  let queryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should return initial data from search params', async () => {
    // Setup mocks
    useParams.mockReturnValue({ id: '123' });
    useSearchParams.mockReturnValue({
      get: (param) => {
        if (param === 'title') return 'Software Engineer';
        if (param === 'company') return 'Google';
        return null;
      }
    });
    
    fetchJobDetails.mockResolvedValue({
      id: '123',
      title: 'Software Engineer',
      company: { name: 'Google' },
      description: 'Job description here',
    });
    
    const { result } = renderHook(() => useJobDetails(), { wrapper });
    
    // Initial data should be available immediately
    expect(result.current.job).toEqual({
      id: '123',
      title: 'Software Engineer',
      company: { name: 'Google' },
    });
    
    // Wait for the query to complete
    await waitFor(() => expect(fetchJobDetails).toHaveBeenCalledWith('123'));
    
    // Should have the full data after the query completes
    expect(result.current.job).toEqual({
      id: '123',
      title: 'Software Engineer',
      company: { name: 'Google' },
      description: 'Job description here',
    });
  });

  it('should handle loading state', async () => {
    useParams.mockReturnValue({ id: '456' });
    useSearchParams.mockReturnValue({
      get: () => null,
    });
    
    // Don't resolve the promise yet to keep the loading state true
    fetchJobDetails.mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useJobDetails(), { wrapper });
    
    // Check isLoading immediately after render, before any async operations complete
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', async () => {
    useParams.mockReturnValue({ id: '789' });
    useSearchParams.mockReturnValue({
      get: () => null,
    });
    
    const error = new Error('Failed to fetch job details');
    fetchJobDetails.mockRejectedValue(error);
    
    const { result } = renderHook(() => useJobDetails(), { wrapper });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.errorMessage).toBe('Failed to fetch job details');
  });

  it('should not fetch if jobId does not exist', () => {
    useParams.mockReturnValue({});
    useSearchParams.mockReturnValue({
      get: () => null,
    });
    
    renderHook(() => useJobDetails(), { wrapper });
    
    expect(fetchJobDetails).not.toHaveBeenCalled();
  });
});