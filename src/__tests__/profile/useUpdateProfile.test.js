import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUpdateProfile from '../../app/hooks/useUpdateProfile';
import { updateProfile } from '../../app/services/updateProfile';
import React from 'react';

// Mock dependencies
jest.mock('../../app/services/updateProfile');

describe('useUpdateProfile', () => {
  let queryClient;
  let wrapper;
  
  beforeEach(() => {
    // Create fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    
    // Create wrapper component with QueryClientProvider
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    // Reset mocks
    jest.clearAllMocks();
    updateProfile.mockReset();
  });
  
  test('should return a mutation function', () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });
    
    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending', false);
    expect(result.current).toHaveProperty('isError', false);
    expect(result.current).toHaveProperty('isSuccess', false);
  });
  
  test('should call updateProfile when mutate is called', async () => {
    // Setup the mock to resolve successfully
    const mockResponse = { success: true };
    updateProfile.mockResolvedValue(mockResponse);
    
    // Render the hook
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });
    
    // Call the mutation function (without act)
    result.current.mutate({ 
      api: 'test-api', 
      data: { test: 'data' }, 
      method: 'POST' 
    });
    
    // Wait for updateProfile to be called
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('test-api', { test: 'data' }, 'POST');
    });
    
    // Wait for success state
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
  
  test('should handle errors', async () => {
    // Setup the mock to reject with an error
    const error = new Error('API error');
    updateProfile.mockRejectedValue(error);
    
    // Render the hook
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });
    
    // Call the mutation function
    result.current.mutate({ 
      api: 'test-api', 
      data: { test: 'data' }, 
      method: 'POST' 
    });
    
    // Wait for updateProfile to be called
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('test-api', { test: 'data' }, 'POST');
    });
    
    // Wait for error state
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    
    // This may be undefined - adjust based on how your hook handles errors
    expect(result.current.error).toBeDefined();
  });
  
  test('should invalidate userProfile queries on success', async () => {
    // Setup the mock to resolve successfully
    updateProfile.mockResolvedValue({ success: true });
    
    // Spy on invalidateQueries
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    
    // Render the hook
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });
    
    // Call the mutation function
    result.current.mutate({ 
      api: 'test-api', 
      data: { test: 'data' }, 
      method: 'POST' 
    });
    
    // Wait for updateProfile to be called
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('test-api', { test: 'data' }, 'POST');
    });
    
    // Wait for success state
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    // Check if invalidateQueries was called with correct query key
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["userProfile"] });
  });
});