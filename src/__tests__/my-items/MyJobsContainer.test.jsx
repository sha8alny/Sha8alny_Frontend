import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchAppliedJobs } from '@/app/services/jobs';
import MyJobsContainer from '@/app/components/modules/my-items/container/MyJobsContainer';

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../app/services/jobs', () => ({
    fetchAppliedJobs: jest.fn(),
}));


const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
};

describe('MyJobsContainer', () => {
    let useQueryMock, routerMock, mockJobs;

    beforeEach(() => {
        mockJobs = [
            { 
                _id: '123', 
                title: 'Software Engineer', 
                companyData: { name: 'Tech Corp' },
                createdAt: '2023-01-01T12:00:00Z',
                status: 'pending'
            },
            { 
                _id: '456', 
                title: 'Product Manager', 
                companyData: { name: 'Acme Inc' },
                createdAt: '2023-02-15T09:30:00Z',
                status: 'viewed'
            }
        ];

        useQueryMock = useQuery.mockReturnValue({
            data: mockJobs,
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: true,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        });

        routerMock = { push: jest.fn() };
        useRouter.mockReturnValue(routerMock);

        fetchAppliedJobs.mockResolvedValue(mockJobs);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders jobs presentation component with data', () => {
        render(<MyJobsContainer />);
        
        expect(screen.getByText('My Jobs')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    test('renders all tabs correctly', () => {
        render(<MyJobsContainer />);
        
        expect(screen.getByRole('tab', { name: /All/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Pending/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Accepted/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Rejected/i })).toBeInTheDocument();
    });

    test('All tab is active by default', () => {
        render(<MyJobsContainer />);
        
        const allTab = screen.getByRole('tab', { name: /All/i });
        expect(allTab).toHaveAttribute('aria-selected', 'true');
    });


    test('activates correct tab when clicked', async () => {
        render(<MyJobsContainer />);
        
        const tabs = screen.getAllByRole('tab');
      
        const allTab = tabs.find(tab => tab.textContent.match(/All Applications/i));
        const acceptedTab = tabs.find(tab => tab.textContent.match(/Accepted/i));
        const rejectedTab = tabs.find(tab => tab.textContent.match(/Rejected/i));
        const pendingTab = tabs.find(tab => tab.textContent.match(/Pending/i));
      
        expect(allTab).toHaveAttribute('aria-selected', 'true');
      
        // Click Pending
        await userEvent.click(pendingTab);
      
        await waitFor(() => {
          expect(pendingTab).toHaveAttribute('aria-selected', 'true');
        });
      
        // Click Accepted
        await userEvent.click(acceptedTab);
        await waitFor(() => {
          expect(acceptedTab).toHaveAttribute('aria-selected', 'true');
        });
      
        // Click Rejected
        await userEvent.click(rejectedTab);
        await waitFor(() => {
          expect(rejectedTab).toHaveAttribute('aria-selected', 'true');
        });
      
        // Back to All Applications
        await userEvent.click(allTab);
        await waitFor(() => {
          expect(allTab).toHaveAttribute('aria-selected', 'true');
        });
      });
    
    

    
    test('displays message when no rejected jobs are available', async () => {
        useQuery.mockReturnValueOnce({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<MyJobsContainer />);
        
        // Click on the Rejected tab to activate it
        await userEvent.click(screen.getByRole('tab', { name: /Rejected/i }));
        
        expect(screen.getByText('No rejected job applications')).toBeInTheDocument();
    });
    test('displays loading state when data is loading', () => {
        useQuery.mockReturnValueOnce({
            isLoading: true,
            data: null,
            error: null,
        });

        render(<MyJobsContainer />);
        
        expect(screen.getByText(/Loading job listings/i)).toBeInTheDocument();
    });

    test('displays error message when query fails', () => {
        useQuery.mockReturnValueOnce({
            isLoading: false,
            isError : true,
            data: null,
            error: { message: 'Failed to fetch jobs' },
        });

        render(<MyJobsContainer />);
        
        expect(screen.getByText('Error loading job listings: Failed to fetch jobs')).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch jobs/i)).toBeInTheDocument();
    });

    test('navigates to job details when a job is clicked', () => {
        render(<MyJobsContainer />);
        
        fireEvent.click(screen.getByText('Software Engineer'));
        
        expect(routerMock.push).toHaveBeenCalledWith('/jobs/123?title=Software%20Engineer&company=Tech%20Corp');
    });

    test('navigates to jobs page when More Jobs button is clicked', () => {
        render(<MyJobsContainer />);
        
        fireEvent.click(screen.getByText('Apply to Jobs'));
        
        expect(routerMock.push).toHaveBeenCalledWith('/jobs');
    });

    test('formats date correctly', () => {
        render(<MyJobsContainer />);
        
        expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    });

    test('formats time correctly', () => {
        render(<MyJobsContainer />);
        
        const formattedTime = formatTime('2023-01-01T12:00:00Z');
        expect(screen.getByText(formattedTime)).toBeInTheDocument();
    });


    test('displays accepted jobs in the Accepted tab', () => {
        const acceptedJobs = [
            { 
                _id: '789', 
                title: 'Data Scientist', 
                companyData: { name: 'Data Corp' },
                createdAt: '2023-03-01T10:00:00Z',
                status: 'accepted'
            }
        ];
        useQuery.mockReturnValueOnce({
            data: acceptedJobs,
            isLoading: false,
            error: null,
        });

        render(<MyJobsContainer />);
        
        // Click on the Accepted tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /Accepted/i }));
        
        expect(screen.getByText('Data Scientist')).toBeInTheDocument();
        expect(screen.getByText('Data Corp')).toBeInTheDocument();
    });

    test('displays rejected jobs in the Rejected tab', () => {
        const rejectedJobs = [
            { 
                _id: '101', 
                title: 'UX Designer', 
                companyData: { name: 'Design Studio' },
                createdAt: '2023-04-01T14:00:00Z',
                status: 'rejected'
            }
        ];
        useQuery.mockReturnValueOnce({
            data: rejectedJobs,
            isLoading: false,
            error: null,
        });
        
        render(<MyJobsContainer />);
        
        // Click on the Rejected tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /Rejected/i }));
        
        expect(screen.getByText('UX Designer')).toBeInTheDocument();
        expect(screen.getByText('Design Studio')).toBeInTheDocument();
    });
    test('displays message when no accepted jobs are available', async () => {
        useQuery.mockReturnValueOnce({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<MyJobsContainer />);
        
        // Select the Accepted tab using role selector for consistency
        await userEvent.click(screen.getByRole('tab', { name: /Accepted/i }));
        
        expect(screen.getByText('No accepted job applications yet')).toBeInTheDocument();
    });
    test('displays pending jobs in the Pending tab', () => {
        const pendingJobs = [
            { 
                _id: '202', 
                title: 'Frontend Developer', 
                companyData: { name: 'Web Solutions' },
                createdAt: '2023-05-01T08:00:00Z',
                status: 'pending'
            }
        ];
        useQuery.mockReturnValueOnce({
            data: pendingJobs,
            isLoading: false,
            error: null,
        });

        render(<MyJobsContainer />);
        
        // Click on the Pending tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /Pending/i }));
        
        expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
        expect(screen.getByText('Web Solutions')).toBeInTheDocument();
    });
    test('displays message when no pending jobs are available', async () => {
        useQuery.mockReturnValueOnce({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<MyJobsContainer />);
        
        // Click on the Pending tab to activate it
        await userEvent.click(screen.getByRole('tab', { name: /Pending/i }));
        
        expect(screen.getByText('No pending job applications')).toBeInTheDocument();
    });
});
