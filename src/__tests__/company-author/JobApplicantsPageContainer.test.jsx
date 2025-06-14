import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobApplicantsPageContainer from "../../app/components/modules/company-jobs/container/JobApplicantsPageContainer";
import { JobApplicants } from "../../app/services/companyManagement";
import JobApplicantsPage from "../../app/components/modules/company-jobs/presentation/JobApplicantsPage";
import "@testing-library/jest-dom";
jest.mock("../../app/services/companyManagement", () => ({
  JobApplicants: jest.fn(),
}));
import userEvent from "@testing-library/user-event";


describe("JobApplicantsPageContainer", () => {
  const mockOnBack = jest.fn();
  const mockJobId = "123";
  const mockApplicantsPage1 = [
    { id: "1", username: "John Doe", headline: "Developer", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "2", username: "Jane Doe", headline: "Designer", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
    { id: "3", username: "Lily Doe", headline: "Frontend Developer", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "4", username: "Nancy Doe", headline: "Artist", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
    { id: "5", username: "Adam Doe", headline: "Arch", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "6", username: "Janin Doe", headline: "Accountant", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
  ];
  const mockApplicantsPage2 = [
    { id: "7", username: "Micheal Doe", headline: "Tester", profilePic: "profile1.jpg", coverPhoto: "cover1.jpg" },
    { id: "8", username: "Jane Doe", headline: "Devops", profilePic: "profile2.jpg", coverPhoto: "cover2.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const renderComponent = (jobId = "123") =>
    render(<JobApplicantsPageContainer jobId={jobId} onBack={mockOnBack} />);
  
  test("renders the applicants page correctly", async () => {
    // Mocking the JobApplicants API response
    JobApplicants
    .mockResolvedValueOnce(mockApplicantsPage1) // First call: page 1
    .mockResolvedValueOnce([]);                
      
    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}   username="testCompany" />);
  
    // Check for loading text, this time using a more flexible match
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
    // Wait for applicants to be rendered
    await waitFor(() => {
      mockApplicantsPage1.forEach((applicant) => {
        expect(screen.getByText(applicant.headline)).toBeInTheDocument();
      });
    });
  });
  

  test('shows loading text when isLoading is true', () => {
    render(<JobApplicantsPage isLoading={true} Applicants={[]} />);
    
    const loadingText = screen.getByText(/loading/i);  // case insensitive search for "loading"
    expect(loadingText).toBeInTheDocument();
  });

  test("shows no applicants when the list is empty", async () => {
    JobApplicants.mockResolvedValueOnce([]);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}         username="testCompany"
      />);

    // Check if "No Applicants yet" text is shown
    await waitFor(() => {
      expect(screen.getByText(/No Applicants yet/)).toBeInTheDocument();
    });
  });

  test("handles next page icon click", async () => {
    JobApplicants
    .mockResolvedValueOnce(mockApplicantsPage1) // page 1
    .mockResolvedValueOnce(mockApplicantsPage2); // for hasMore check
    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}         username="testCompany"
      />);

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("Developer")).toBeInTheDocument();
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
    JobApplicants
    .mockResolvedValueOnce(mockApplicantsPage1) // page 1
    .mockResolvedValueOnce(mockApplicantsPage2) // for hasMore check
    .mockResolvedValueOnce(mockApplicantsPage2) // actual page 2 load
    .mockResolvedValueOnce(mockApplicantsPage1); // when going back
  
  
    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}         username="testCompany"
      />);
  
    // Wait for applicants from page 1 to be rendered
    await waitFor(() => {
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Designer")).toBeInTheDocument();
    });
  
    // Simulate clicking the next page icon (to go to page 2)
    const nextButton = screen.getByLabelText(/ArrowForwardIos/i);
    fireEvent.click(nextButton);
  
    // Wait for applicants from page 2 to be rendered
    await waitFor(() => {
      expect(screen.getByText("Tester")).toBeInTheDocument();
      expect(screen.getByText("Devops")).toBeInTheDocument();
    });
  
    // Simulate clicking the previous page icon (to go back to page 1)
    const prevButton = screen.getByLabelText(/ArrowBackIos/i); // Query by aria-label
    expect(prevButton).toBeInTheDocument();
    
    fireEvent.click(prevButton);
  
    // Check if the first page of applicants is fetched again
    expect(JobApplicants).toHaveBeenCalledWith(mockJobId, 1);
  });
  


  // test("handles view application icon click and toggles the selected applicant", async () => {
  //   JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

  //   render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}         username="testCompany"
  //     />);

  //   // Wait for applicants to be rendered
  //   await waitFor(() => {
  //     expect(screen.getByText("Developer")).toBeInTheDocument();
  //   });

  //   const buttons = await screen.findAllByText("View Application");
  //   await userEvent.click(buttons[0]);
    
    
  //   await waitFor(() => {
  //     expect(
  //       screen.getByText((content, node) =>
  //         node?.textContent?.toLowerCase().includes("view resume")
  //       )
  //     ).toBeInTheDocument();
  //   });
    
    
  //   // Simulate clicking the same button again to trigger the toggle (setTimeout logic)
  //   fireEvent.click(buttons[0]);
  //   await waitFor(() => {
  //     expect(screen.getAllByText(/Developer/)).toBeInTheDocument();
  //   });

  //   // Simulate clicking a different applicant to switch the view
  //   fireEvent.click(buttons[1]);
  //   await waitFor(() => {
  //     expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  //   });
  // });

  // it("handles closeApplicationDetails and clears the selected applicant", async () => {
  //   JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

  //   renderComponent();

  //   // Wait for applicants to be rendered
  //   await waitFor(() => {
  //     expect(screen.getByText("John Doe")).toBeInTheDocument();
  //   });

  //   // Simulate clicking the first "View Application" button
  //   const buttons = screen.getAllByText("View Application");
  //   fireEvent.click(buttons[0]);

  //   // Ensure the application modal is displayed
  //   expect(screen.getByText(/John Doe/)).toBeInTheDocument();

  //   // Simulate closing the application details (using the "Close" button)
  //   const closeButton = screen.getByRole("button", { name: /close/i });
  //   fireEvent.click(closeButton);

  //   // Verify the application details are hidden
  //   await waitFor(() => {
  //     expect(screen.queryByText(/John Doe/)).not.toBeInTheDocument();
  //   });
  // });

  test("calls the onBack function when back icon is clicked", async () => {
    JobApplicants.mockResolvedValueOnce(mockApplicantsPage1);

    render(<JobApplicantsPageContainer jobId={mockJobId} onBack={mockOnBack}         username="testCompany"
      />);

    // Wait for applicants to be rendered
    await waitFor(() => {
      expect(screen.getByText("Developer")).toBeInTheDocument();
    });
    
    const backButton = screen.getByLabelText(/ArrowBack/i); // Queries by the aria-label instead
    expect(backButton).toBeInTheDocument();
    
    
    // Then, simulate the click
    fireEvent.click(backButton);
    // Check if onBack function is called
    expect(mockOnBack).toHaveBeenCalled();
  });
  

});
