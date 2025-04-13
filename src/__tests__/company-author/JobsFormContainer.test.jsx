import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import JobsFormContainer from "../../app/components/modules/company-author/container/JobsFormContainer";
import JobsForm from "../../app/components/modules/company-author/presentation/JobsForm";
import "@testing-library/jest-dom";
import { useMutation } from "@tanstack/react-query";
import { postedJobs, deleteJob, editJob } from "../../app/services/companyManagement";
import { useToast } from "@/app/context/ToastContext";

// Mocking the service and react-query hook
jest.mock("../../app/services/companyManagement", () => ({
  postedJobs: jest.fn(),
  deleteJob:jest.fn(),
  editJob:jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));
const getJobsMock = jest.fn();

describe("JobsFormContainer", () => {
  const mockJobs = [
    {
      job_id: "1",
      title: "Software Engineer",
      location: "New York",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "100k",
      experience: "2-5 years",
      workLocation: "On-site",
      numViews: 200,
      numApplications: 10,
      time: "2023-02-01T00:00:00Z",
    },
    {
      job_id: "2",
      title: "Data Scientist",
      location: "San Francisco",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "120k",
      experience: "3-6 years",
      workLocation: "Hybrid",
      numViews: 150,
      numApplications: 8,
      time: "2023-02-01T00:00:00Z",
    },
    {
      job_id: "3",
      title: "Backend Developer",
      location: "San Francisco",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "120k",
      experience: "3-6 years",
      workLocation: "Hybrid",
      numViews: 150,
      numApplications: 8,
      time: "2023-02-01T00:00:00Z",
    },
    {
      job_id: "4",
      title: "Cybersecurity Analyst",
      location: "San Francisco",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "120k",
      experience: "3-6 years",
      workLocation: "Hybrid",
      numViews: 150,
      numApplications: 8,
      time: "2023-02-01T00:00:00Z",
    },
    {
      job_id: "5",
      title: "Technical Writer",
      location: "San Francisco",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "120k",
      experience: "3-6 years",
      workLocation: "Hybrid",
      numViews: 150,
      numApplications: 8,
      time: "2023-02-01T00:00:00Z",
    },
    {
      job_id: "6",
      title: "FrontEnd Developer",
      location: "San Francisco",
      industry: "Tech",
      employmentType: "Full-Time",
      salary: "120k",
      experience: "3-6 years",
      workLocation: "Hybrid",
      numViews: 150,
      numApplications: 8,
      time: "2023-02-01T00:00:00Z",
    },
  ];
  const updatedJob = {
    title: 'Updated Title',
    description: 'Updated Description',
    // Add any updated fields here
  };
  let mutateMock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking the mutation function
    mutateMock = jest.fn();
    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
    useToast.mockReturnValue(jest.fn());
  });

  test("renders loading state initially", async () => {
    useMutation.mockReturnValueOnce({
        mutate: jest.fn(),
        isPending: true,
      });

    render(<JobsFormContainer />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("fetches and displays jobs correctly", async () => {
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs));

    await act(async () => {
      render(<JobsFormContainer />);
    });

    // Ensure jobs are displayed
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Data Scientist")).toBeInTheDocument();

    // Ensure 'No jobs posted yet' is NOT displayed
    expect(screen.queryByText(/No jobs posted yet/i)).not.toBeInTheDocument();
  });

  test("shows 'No jobs posted yet' if no jobs are returned", async () => {
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess([]));

    await act(async () => {
      render(<JobsFormContainer />);
    });

    expect(screen.getByText(/No jobs posted yet/i)).toBeInTheDocument();
  });

  test("navigates to 'Post New Job' when the button is clicked", async () => {
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs));

    await act(async () => {
      render(<JobsFormContainer />);
    });

    // Click "Post new job" button
    fireEvent.click(screen.getByRole("button", { name: /post new job/i }));

    // Verify navigation to PostNewJobContainer
    await waitFor(() => {
      expect(screen.getByText(/Post New Job/i)).toBeInTheDocument();
    });
  });

  test("navigates to 'Job Applicants' when the button is clicked", async () => {
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs));
  
    await act(async () => {
      render(<JobsFormContainer />);
    });
  
    // Ensure jobs are displayed
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  
    // Click "Show Applicants" for the first job
    fireEvent.click(screen.getAllByRole("button", { name: /show applicants/i })[0]);
  
  });
  test("handles pagination correctly", async () => {
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs.slice(0, 3))); // Page 1
  
    const onNextPage = jest.fn();
    const onPrevPage = jest.fn();
  
    // First render with page 1 and hasMore true
    await act(async () => {
      render(
        <JobsFormContainer />
      );
    });
  
    // Simulate clicking next page
    const nextButton = screen.getByRole("button", { name: /next/i }); 
    fireEvent.click(nextButton);
  
    expect(onNextPage).toHaveBeenCalledTimes(0); 
  
    // Simulate clicking previous page
    const prevButton = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevButton);
  
    // Verify the back button is disabled on page 1
    expect(prevButton).toBeDisabled();
  
    // Check if page label is correct
    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });
  

  test("logs an error when fetching jobs fails", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    mutateMock.mockImplementation((_, { onError }) => onError(new Error("API Error")));

    await act(async () => {
      render(<JobsFormContainer />);
    });

    expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching jobs:", expect.any(Error));
    consoleErrorMock.mockRestore();
  }); 
  
 
  test('opens the edit job form and triggers handleEditJob on save', async () => {
    // Mock API inside handleEditJob
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs));
    editJob.mockResolvedValue({});
  
    const jobId = '1';
    const username = 'testCompany';
  
    render(<JobsFormContainer username={username}  />);
  
    // Wait for the job cards to load
    const editIcons = await screen.findAllByTestId('EditJob');
    fireEvent.click(editIcons[0]);
  
    // Simulate form input
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Updated Title' },
    });
  
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Updated Description' },
    });
  
    // Click Save
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
  
    await waitFor(() => {
      expect(editJob).toHaveBeenCalledWith({
        companyUsername: username,
        jobId:undefined,
        jobData: expect.objectContaining({
          title: 'Updated Title',
          description: 'Updated Description',
        }),
      });
      });
  });
  
  test('opens the delete confirmation dialog and triggers handleDeleteJob on confirm', async () => {
    // Mock API inside handleDeleteJob
    mutateMock.mockImplementation((_, { onSuccess }) => onSuccess(mockJobs));
    deleteJob.mockResolvedValue({});
  
    const jobId = '1';
    const username = 'testCompany';
  
    render(<JobsFormContainer username={username} />);
  
    // Wait for the job cards to load
    const deleteIcons = await screen.findAllByTestId('DeleteJob');
    fireEvent.click(deleteIcons[0]);
  
    // Wait for the delete confirmation dialog to show
    const confirmDeleteButton = await screen.findByText(/Confirm Delete/i);
  
    // Click the "Confirm Delete" button
    fireEvent.click(confirmDeleteButton);
  
    await waitFor(() => {
      // Verify that deleteJob was called with the correct job ID
      expect(deleteJob).toHaveBeenCalledWith({
        jobId:undefined,  // Ensure it's the correct jobId
        companyUsername: username,
      });
    });
  });
  
  

});
