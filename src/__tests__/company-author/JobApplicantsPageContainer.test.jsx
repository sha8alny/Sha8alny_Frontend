import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobApplicantsPageContainer from "../../app/components/modules/company-author/container/JobApplicantsPageContainer";
import { JobApplicants } from "../../app/services/companyManagment";
import JobApplicantsPage from "../../app/components/modules/company-author/presentation/JobApplicantsPage";
import "@testing-library/jest-dom";
jest.mock("../../app/services/companyManagment", () => ({
  JobApplicants: jest.fn(),
}));


describe("JobApplicantsPageContainer", () => {
  const mockOnBack = jest.fn();
  const mockJobId = "123";
  const mockApplicantsPage1 = [
    { id: "1", username: "John Doe", headline: "Developer", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "2", username: "Jane Doe", headline: "Designer", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
  ];
  const mockApplicantsPage2 = [
    { id: "3", username: "Micheal Doe", headline: "Developer", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "4", username: "Jane Doe", headline: "Designer", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const renderComponent = (jobId = "123") =>
    render(<JobApplicantsPageContainer jobId={jobId} onBack={mockOnBack} />);
  
  test("renders the applicants page correctly", async () => {
    // Mocking the JobApplicants API response
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);
  
    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);
  
    // Check for loading text, this time using a more flexible match
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
    // Wait for applicants to be rendered
    await waitFor(() => {
      mockApplicantsPage1.forEach((applicant) => {
        expect(screen.getByText(applicant.username)).toBeInTheDocument();
        expect(screen.getByText(applicant.headline)).toBeInTheDocument();
      });
    });
  });
  

  test('shows loading text when isLoading is true', () => {
    render(<JobApplicantsPage isLoading={true} Applicants={[]} />);
    
    const loadingText = screen.getByText(/loading/i);  // case insensitive search for "loading"
    expect(loadingText).toBeInTheDocument();
  });

  test('shows "Loading more..." when more items are being loaded', () => {
    render(
      <JobApplicantsPage
        Applicants={[{ id: 1, username: 'John Doe', headline: 'Developer' }]}
        isLoading={true}
        hasMore={true}
        onBack={() => {}}
        onNext={() => {}}
        onPrev={() => {}}
        onViewApplication={() => {}}
        jobId="123"
        selectedApplicant={null}
        onCloseApplicationDetails={() => {}}
      />
    );
  
    const loadingMoreText = screen.getByText(/loading more/i); // case-insensitive match
    expect(loadingMoreText).toBeInTheDocument();
  });
  

  test("shows no applicants when the list is empty", async () => {
    JobApplicants.mockResolvedValueOnce([]);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);

    // Check if "No Applicants yet" text is shown
    await waitFor(() => {
      expect(screen.getByText(/No Applicants yet/)).toBeInTheDocument();
    });
  });

  test("handles next page icon click", async () => {
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate clicking the next page icon
    const nextButton = screen.getByLabelText(/ArrowForwardIos/i); // Queries by the aria-label instead
    expect(nextButton).toBeInTheDocument();
    
    // Then, simulate the click
    fireEvent.click(nextButton);
    // Check if the next page of applicants is fetched
    expect(JobApplicants).toHaveBeenCalledWith(mockJobId, 2);
  });

  test("handles previous page icon click after rendering page 2", async () => {
    // Mocking the responses for both pages
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1); // First page
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage2); // Second page
  
    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);
  
    // Wait for applicants from page 1 to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  
    // Simulate clicking the next page icon (to go to page 2)
    const nextButton = screen.getByLabelText(/ArrowForwardIos/i);
    fireEvent.click(nextButton);
  
    // Wait for applicants from page 2 to be rendered
    await waitFor(() => {
      expect(screen.getByText("Micheal Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  
    // Simulate clicking the previous page icon (to go back to page 1)
    const prevButton = screen.getByLabelText(/ArrowBackIos/i); // Query by aria-label
    expect(prevButton).toBeInTheDocument();
    
    fireEvent.click(prevButton);
  
    // Check if the first page of applicants is fetched again
    expect(JobApplicants).toHaveBeenCalledWith(mockJobId, 1);
  });
  


  test("handles view application icon click and toggles the selected applicant", async () => {
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate clicking the view application button
    const buttons = screen.getAllByText("View Application");

    // Simulate clicking the first button
    fireEvent.click(buttons[0]);
    
    // Check if the application details modal appears
    expect(screen.getByText(/Application for/)).toBeInTheDocument();

    // Simulate clicking the same button again to trigger the toggle (setTimeout logic)
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByText(/Application for/)).toBeInTheDocument();
    });

    // Simulate clicking a different applicant to switch the view
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(screen.getByText(/Application for/)).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("handles closeApplicationDetails and clears the selected applicant", async () => {
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

    renderComponent();

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate clicking the first "View Application" button
    const buttons = screen.getAllByText("View Application");
    fireEvent.click(buttons[0]);

    // Ensure the application modal is displayed
    expect(screen.getByText(/Application for/)).toBeInTheDocument();

    // Simulate closing the application details (using the "Close" button)
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Verify the application details are hidden
    await waitFor(() => {
      expect(screen.queryByText(/Application for/)).not.toBeInTheDocument();
    });
  });

  test("calls the onBack function when back icon is clicked", async () => {
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack} />);

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
    
    const backButton = screen.getByLabelText(/ArrowBack/i); // Queries by the aria-label instead
    expect(backButton).toBeInTheDocument();
    
    
    // Then, simulate the click
    fireEvent.click(backButton);
    // Check if onBack function is called
    expect(mockOnBack).toHaveBeenCalled();
  });
  

});
