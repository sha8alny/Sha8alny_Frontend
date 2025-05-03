import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JobsFormContainer from "../../app/components/modules/company-jobs/container/JobsFormContainer";
import {
  postedJobs,
  deletedJobs,
  deleteJob,
  editJob,
  restoreJob,
} from "../../app/services/companyManagement";
import { useToast } from "@/app/context/ToastContext";
import "@testing-library/jest-dom";

jest.mock(".../../../app/services/companyManagement");
jest.mock("../../app/context/ToastContext");

const mockPostedJobs = [
  { id: "1", title: "Software Engineer" },
  { id: "2", title: "Frontend Developer" },
  { id: "3", title: "Backend Developer" },
  { id: "4", title: "Full Stack Developer" },
  { id: "5", title: "Data Scientist" },
  { id: "6", title: "DevOps Engineer" },
  { id: "7", title: "UX/UI Designer" },
  { id: "8", title: "Product Manager" },
  { id: "9", title: "QA Engineer" },
  { id: "10", title: "System Administrator" },
];
const mockDeletedJobs = [
  { id: "3", title: "Deleted Job 1" },
  { id: "4", title: "Deleted Job 2" },
  { id: "5", title: "Deleted Job 3" },
  { id: "6", title: "Deleted Job 4" },
  { id: "7", title: "Deleted Job 5" },
  { id: "8", title: "Deleted Job 6" },
  { id: "9", title: "Deleted Job 7" },
  { id: "10", title: "Deleted Job 8" },
];

describe("JobsFormContainer", () => {
  let toastMock;
  let queryClient;


  beforeEach(() => {
    jest.clearAllMocks();
    toastMock = jest.fn();
    useToast.mockReturnValue(toastMock);

    postedJobs.mockImplementation(({ page }) => {
      if (page === 1) {
        return Promise.resolve(mockPostedJobs.slice(0, 5)); // First 5 jobs
      } else if (page === 2) {
        return Promise.resolve(mockPostedJobs.slice(5, 10)); // Next 5 jobs
      }
      return Promise.resolve([]);
    });
    deletedJobs.mockResolvedValue(mockDeletedJobs);
    deleteJob.mockResolvedValue(true);
    editJob.mockResolvedValue(true);
    restoreJob.mockResolvedValue(true);
    queryClient = new QueryClient();
  });

  const renderWithQueryClient = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };
  test("renders active jobs and handles pagination", async () => {
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Wait for active jobs to load
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    // Simulate clicking the next page button
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    // Verify that the next page of jobs is fetched
    await waitFor(() => {
      expect(postedJobs).toHaveBeenCalledWith({ page: 2, companyUsername: "testCompany" });
    });
    });

  test("toggles between active and deleted jobs", async () => {
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Wait for active jobs to load
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    // Simulate toggling to show deleted jobs
    const toggleDeletedJobsButton = screen.getByText(/Deleted Jobs/i);
    fireEvent.click(toggleDeletedJobsButton);

    // Wait for deleted jobs to load
    await waitFor(() => {
      expect(screen.getByText("Deleted Job 1")).toBeInTheDocument();
      expect(screen.getByText("Deleted Job 2")).toBeInTheDocument();
    });

    // Verify that the deleted jobs API was called
    expect(deletedJobs).toHaveBeenCalledWith({ page: 1, companyUsername: "testCompany" });
  });

  test("handles restoring a deleted job", async () => {
    restoreJob.mockResolvedValueOnce(true); // Mock restoreJob to resolve successfully
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Simulate toggling to show deleted jobs
    const toggleDeletedJobsButton = screen.getByText(/Deleted Jobs/i);
    fireEvent.click(toggleDeletedJobsButton);

    // Wait for deleted jobs to load
    await waitFor(() => {
      expect(screen.getByText("Deleted Job 1")).toBeInTheDocument();
    });

    // Simulate clicking the restore button for a deleted job
    const restoreButton = screen.getAllByText(/Restore/i);
    fireEvent.click(restoreButton[0]); 
        // If a confirmation dialog appears:
    const confirmButton = await screen.findAllByTestId("restore-job");
    fireEvent.click(confirmButton[0]); // Simulate clicking the confirm button
    // Verify that the restoreJob function was called
    await waitFor(() => {
      expect(restoreJob).toHaveBeenCalledWith({ companyUsername: "testCompany", jobId: undefined });
      expect(toastMock).toHaveBeenCalledWith("Job restored successfully!");
    });
      

  });

  test("handles deleting a job", async () => {
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Wait for active jobs to load
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    // Simulate clicking the delete button for a job
    const deleteButton = screen.getAllByText(/Delete/i); 
    fireEvent.click(deleteButton[0]); 

  });

  test("navigates to 'Job Applicants' when the button is clicked", async () => {
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    // Simulate clicking "Show Applicants" for the first job
    const showApplicantsButton = screen.getAllByText(/Show Applicants/i);
    fireEvent.click(showApplicantsButton[0]); // Assuming the first job is clicked
  });
  it("handles deleting a job successfully", async () => {
    deleteJob.mockResolvedValueOnce(true); // Mock deleteJob to resolve successfully
  
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);
  
    // Wait for the delete button to appear
    const deleteButton = await screen.findAllByTestId("DeleteJob"); // Ensure the test ID matches the component
    fireEvent.click(deleteButton[0]); // Simulate clicking the first delete button
    // If a confirmation dialog appears:
    const confirmButton = await screen.findAllByTestId("confirm-delete"); // or whatever the confirm button says
    fireEvent.click(confirmButton[0]); // Simulate clicking the confirm button
  
    // Wait for the toast message
    await waitFor(() => {
      expect(deleteJob).toHaveBeenCalledWith({ companyUsername: "testCompany", jobId: undefined });
      expect(toastMock).toHaveBeenCalledWith("Job deleted successfully!");
    });
  });
  it("handles editing a job successfully", async () => {
    editJob.mockResolvedValueOnce(true);

    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Simulate updating the job data
    await waitFor(() => {
    const editButton = screen.getAllByTestId("EditJob"); // Replace with the actual test ID or query for the edit button
    fireEvent.click(editButton[0]); // Simulate clicking the first edit button
    }
    );
  // Fill out the edit form fields
  fireEvent.change(screen.getAllByTestId("edit-title")[0], { target: { value: "Updated Job Title" } });

  // Simulate clicking the save button
  const saveButton = screen.getAllByTestId("save-edit");
  fireEvent.click(saveButton[0]); // Simulate clicking the first save button

  // Wait for the toast message
  await waitFor(() => {
    expect(editJob).toHaveBeenCalledWith({
      companyUsername: "testCompany",
      jobId: undefined, // Ensure the job ID is passed correctly
      jobData: {
        title: "Updated Job Title",
      },
    });
      expect(toastMock).toHaveBeenCalledWith("Job updated successfully!");
    });

  });

  test("handles pagination correctly", async () => {
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);

    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    // Simulate clicking the next page button
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    // Verify that the next page of jobs is fetched
    expect(postedJobs).toHaveBeenCalledWith({ page: 2, companyUsername: "testCompany" });

    await waitFor(() => {
      expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
    });
    // Simulate clicking the previous page button
    const prevButton = screen.getByTestId("prev-page");
    fireEvent.click(prevButton);

    // Verify that the previous page of jobs is fetched
    expect(postedJobs).toHaveBeenCalledWith({ page: 1, companyUsername: "testCompany" });
  });
  it("checks if there are more deleted jobs to fetch from inside the component", async () => {

    deletedJobs.mockResolvedValueOnce(mockDeletedJobs.slice(0, 5)); // Mock the first page of deleted jobs
    deletedJobs.mockResolvedValueOnce(mockDeletedJobs.slice(5, 10)); // Mock the second page of deleted jobs
  
    renderWithQueryClient(<JobsFormContainer username="testCompany" />);
  
    // Simulate toggling to show deleted jobs
    const toggleDeletedJobsButton = screen.getByText(/Deleted Jobs/i);
    fireEvent.click(toggleDeletedJobsButton);
  
    // Wait for deleted jobs to load
    await waitFor(() => {
      expect(screen.getByText("Deleted Job 1")).toBeInTheDocument();
      expect(screen.getByText("Deleted Job 5")).toBeInTheDocument();
    });
  // Wait for the next page of deleted jobs to load
  await waitFor(() => {
    expect(deletedJobs).toHaveBeenCalledWith({
      page: 2,
      companyUsername: "testCompany",
    });
    // Simulate clicking the next page button
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    expect(screen.getByText("Deleted Job 6")).toBeInTheDocument();
    expect(screen.getByText("Deleted Job 7")).toBeInTheDocument();
  });
});
it("renders PostNewJobContainer when showPostJobForm is true", async () => {
  renderWithQueryClient(<JobsFormContainer username="testCompany" />);

  // Simulate setting showPostJobForm to true
  const postJobButton = screen.getByTestId("PostNewJob"); 
  fireEvent.click(postJobButton);

  // Verify that PostNewJobContainer is rendered
  await waitFor(() => {
    expect(screen.getByText("Post New Job")).toBeInTheDocument(); 
  });
});
});

