import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchAppliedJobs } from '@/app/services/jobs';
import MyJobsContainer from '@/app/components/modules/my-items/container/MyJobsContainer';
import MyJobsPresentation from '@/app/components/modules/my-items/presentation/MyJobsPresentation';

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useInfiniteQuery: jest.fn(),
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
    let useInfiniteQueryMock, routerMock, mockJobs;

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

        // Mock the shape returned by useInfiniteQuery for all three queries
        useInfiniteQueryMock = require('@tanstack/react-query').useInfiniteQuery;
        useInfiniteQueryMock.mockImplementation(({ queryKey }) => {
            // Simulate different data for different keys if needed
            return {
                data: {
                    pages: [
                        { data: mockJobs }
                    ]
                },
                isLoading: false,
                error: null,
                isError: false,
                hasNextPage: false,
                fetchNextPage: jest.fn(),
                isFetchingNextPage: false,
            };
        });

        routerMock = { push: jest.fn(), refresh: jest.fn() };
        useRouter.mockReturnValue(routerMock);

        fetchAppliedJobs.mockResolvedValue(mockJobs);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders jobs presentation component with data', () => {
        render(<MyJobsContainer />);
        
        expect(screen.getByText('My Jobs')).toBeInTheDocument();
        expect(screen.getAllByText('Software Engineer')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Product Manager')[0]).toBeInTheDocument();
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
        
        // The tab label is "All (2)" or similar, so match with regex
        const allTab = screen.getByRole('tab', { name: /^All/i });
        expect(allTab).toHaveAttribute('aria-selected', 'true');
    });

    test('activates correct tab when clicked', async () => {
        render(<MyJobsContainer />);
        
        const tabs = screen.getAllByRole('tab');
      
        // The tab labels are "All (N)", "Accepted (N)", etc.
        const allTab = tabs.find(tab => tab.textContent.match(/^All/i));
        const acceptedTab = tabs.find(tab => tab.textContent.match(/^Accepted/i));
        const rejectedTab = tabs.find(tab => tab.textContent.match(/^Rejected/i));
        const pendingTab = tabs.find(tab => tab.textContent.match(/^Pending/i));
      
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
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            data: { pages: [{ data: [] }] },
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        // Click on the Rejected tab to activate it
        await userEvent.click(screen.getByRole('tab', { name: /^Rejected/i }));
        
        expect(screen.getByText('No rejected job applications')).toBeInTheDocument();
    });

    test('displays loading state when data is loading', () => {
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            isLoading: true,
            data: null,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        expect(screen.getByText(/Loading job listings/i)).toBeInTheDocument();
    });

    test('displays error message when query fails', () => {
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            isLoading: false,
            isError: true,
            data: null,
            error: { message: 'Failed to fetch jobs' },
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        expect(
          screen.getByText((content) =>
            content.includes('Some job data could not be loaded.')
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText((content) =>
            content.includes('Some job categories may be incomplete.')
          )
        ).toBeInTheDocument();
    });

    test('navigates to job details when a job is clicked', () => {
        render(<MyJobsContainer />);
        
        fireEvent.click(screen.getAllByText('Software Engineer')[0]);
        
        expect(routerMock.push).toHaveBeenCalledWith('/jobs/123?title=Software%20Engineer&company=Tech%20Corp');
    });

    test('navigates to jobs page when More Jobs button is clicked', () => {
        render(<MyJobsContainer />);
        
        fireEvent.click(screen.getByText('Apply to Jobs'));
        
        expect(routerMock.push).toHaveBeenCalledWith('/jobs');
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
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            data: { pages: [{ data: acceptedJobs }] },
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        // Click on the Accepted tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /^Accepted/i }));
        
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
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            data: { pages: [{ data: rejectedJobs }] },
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));
        
        render(<MyJobsContainer />);
        
        // Click on the Rejected tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /^Rejected/i }));
        
        expect(screen.getByText('UX Designer')).toBeInTheDocument();
        expect(screen.getByText('Design Studio')).toBeInTheDocument();
    });

    test('displays message when no accepted jobs are available', async () => {
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            data: { pages: [{ data: [] }] },
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        // Select the Accepted tab using role selector for consistency
        await userEvent.click(screen.getByRole('tab', { name: /^Accepted/i }));
        
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
        useInfiniteQueryMock.mockImplementationOnce(() => ({
            data: { pages: [{ data: pendingJobs }] },
            isLoading: false,
            error: null,
            isError: false,
            hasNextPage: false,
            fetchNextPage: jest.fn(),
            isFetchingNextPage: false,
        }));

        render(<MyJobsContainer />);
        
        // Click on the Pending tab to activate it
        fireEvent.click(screen.getByRole('tab', { name: /^Pending/i }));
        
        expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
        expect(screen.getByText('Web Solutions')).toBeInTheDocument();
    });

    // --- MyJobsPresentation loading state ---
    test('shows loading spinner and message when isLoading is true', () => {
        render(
            <MyJobsPresentation
                isLoading={true}
                jobs={[]}
                formatDate={jest.fn()}
                formatTime={jest.fn()}
                getStatusColor={jest.fn()}
                onJobClick={jest.fn()}
                onMoreJobsClick={jest.fn()}
            />
        );
        expect(screen.getByText('Loading saved jobs...')).toBeInTheDocument();
        expect(screen.getByText('Loading saved jobs...').closest('div')).toHaveClass('p-8');
    });

    test('shows disabled feedback button when job has no notes', () => {
        const jobWithoutNotes = {
            _id: '2',
            title: 'Test Job 2',
            companyData: { name: 'Test Co 2' },
            appliedAt: '2023-01-01T12:00:00Z',
            status: 'pending',
            notes: '',
        };
        render(
            <MyJobsPresentation
                jobs={[jobWithoutNotes]}
                formatDate={() => 'Jan 1, 2023'}
                formatTime={() => '12:00 PM'}
                getStatusColor={() => ''}
                onJobClick={jest.fn()}
                onMoreJobsClick={jest.fn()}
            />
        );
        const feedbackBtn = screen.getByTestId('feedback-btn');
        expect(feedbackBtn).toBeDisabled();
    });
});
