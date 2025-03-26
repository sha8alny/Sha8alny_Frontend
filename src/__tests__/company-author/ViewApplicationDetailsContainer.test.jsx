// ViewApplicationDetailsContainer.test.js

import { render, screen, waitFor, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import ViewApplicationDetailsContainer from '../../app/components/modules/company-author/container/ViewApplicationDetailsContainer';
import { getApplication } from '../../app/services/companyManagment';
import '@testing-library/jest-dom';

// Mock the service function
jest.mock('../../app/services/companyManagment');

const mockApplication = {
  jobTitle: 'Software Engineer',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '123-456-7890',
  coverLetter: 'I am excited to join your team.',
  resumeFile: { name: 'resume.pdf' },
  resumeUrl: '/mock/resume.pdf',
};

describe('ViewApplicationDetailsContainer', () => {
  const jobId = 'job-123';
  const applicantId = 'applicant-456';
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays application details', async () => {
    // Mock API response
    getApplication.mockResolvedValue(mockApplication);

    render(
      <ViewApplicationDetailsContainer
        jobId={jobId}
        applicantId={applicantId}
        onClose={onClose}
      />
    );

    // Check loading state
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();


    // Wait for the data to load
    await waitFor(() => {
      expect(getApplication).toHaveBeenCalledWith(jobId, applicantId);
      expect(screen.getByText(/Application for Software Engineer/i)).toBeInTheDocument();
      expect(screen.getByTestId('fullName')).toBeInTheDocument();
      expect(screen.getByTestId('emailAddress')).toBeInTheDocument();
      expect(screen.getByTestId('phoneNumber')).toBeInTheDocument();
      expect(screen.getByTestId('coverLetter')).toBeInTheDocument();

    });
  });

it('renders application details on success', async () => {
    getApplication.mockResolvedValueOnce({
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123-456-7890',
        coverLetter: 'I am excited to join your team.',
        resumeFile: { name: 'resume.pdf' },
        resumeUrl: '/mock/resume.pdf',
    });

    render(<ViewApplicationDetailsContainer jobId="1" applicantId="123" onClose={jest.fn()} />);

    // Wait for modal content
    await waitFor(() => expect(screen.getByText('Application for')).toBeInTheDocument());
});

  it('closes the modal when the close button is clicked', async () => {
    getApplication.mockResolvedValue(mockApplication);

    render(
      <ViewApplicationDetailsContainer
        jobId={jobId}
        applicantId={applicantId}
        onClose={onClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Application for Software Engineer/i)).toBeInTheDocument();
    });

    // Simulate closing the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Ensure the modal is closed
    await waitFor(() => {
      expect(screen.queryByText(/Application for Software Engineer/i)).not.toBeInTheDocument();
    });
  });

  it('does not call API if jobId or applicantId is missing', () => {
    render(<ViewApplicationDetailsContainer jobId={null} applicantId={null} onClose={onClose} />);
    expect(getApplication).not.toHaveBeenCalled();
  });
});
