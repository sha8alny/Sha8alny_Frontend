import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import JobsFormContainer from "../../app/components/modules/company-author/container/JobsFormContainer";
import { postedJobs } from "../../app/services/companyManagment";
import "@testing-library/jest-dom";
import { useMutation } from "@tanstack/react-query";

// Mocking the service and react-query hook
jest.mock("../../app/services/companyManagment", () => ({
  postedJobs: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

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
  ];

  let mutateMock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking the mutation function
    mutateMock = jest.fn();
    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
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
  
    // Verify navigation by checking elements from JobApplicantsPage
    await waitFor(() => {
      expect( screen.getByLabelText(/ArrowBack/i)).toBeInTheDocument(); // Back button
      expect(screen.getByText(/No Applicants yet/)).toBeInTheDocument();
      // Default message
    });
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
});
