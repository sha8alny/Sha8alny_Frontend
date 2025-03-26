import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostNewJobContainer from "../../app/components/modules/company-author/container/PostNewJobContainer";
import { useMutation } from "@tanstack/react-query";
import Sidebar from "../../app/components/modules/company-page-author/container/SideBarContainer";
import "@testing-library/jest-dom";
import { Import } from "lucide-react";
import { postJob } from "../../app/services/companyManagment";


beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
});
jest.mock("../../app/services/companyManagment", () => ({
    postJob: jest.fn(),
  }));
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));
jest.mock("../../app/components/modules/company-page-author/container/SideBarContainer", () => () => (
  <div data-testid="mock-sidebar" />
));

describe("PostNewJobContainer", () => {
  const mockOnBack = jest.fn();
  const mockMutate = jest.fn();
  const mockUsername = "testCompany";
  const mockLogo = "/test-logo.png";

  beforeEach(() => {
    jest.clearAllMocks();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      onSuccess: jest.fn(),
      onError: jest.fn(),
    });
  });

  const renderComponent = async () => {
    render(<PostNewJobContainer onBack={mockOnBack} username={mockUsername} logo={mockLogo}  />);
  };
      // Helper function to fill all form fields
      const fillForm = async () => {
        // Regular inputs (text fields)
        fireEvent.change(screen.getByTestId("title").querySelector("input"), {
          target: { value: "Software Engineer" },
        });
        fireEvent.change(screen.getByTestId("description").querySelector("input"), {
          target: { value: "Develop and maintain software." },
        });
        fireEvent.change(screen.getByTestId("location").querySelector("input"), {
          target: { value: "Cairo" },
        });
        fireEvent.change(screen.getByTestId("work").querySelector("input"), {
          target: { value: "Remote" },
        });
        fireEvent.change(screen.getByTestId("industry").querySelector("input"), {
          target: { value: "Technology" },
        });
        fireEvent.change(screen.getByTestId("salary").querySelector("input"), {
          target: { value: "10000" },
        });
        fireEvent.change(screen.getByTestId("experience").querySelector("input"), {
          target: { value: "Mid Level" },
        });
      
        // Handle Material-UI Select (employmentType)
        fireEvent.mouseDown(screen.getByTestId("employmentType").querySelector("[role='combobox']"));
        const option = await screen.findByRole("option", { name: "Full Time" });
        fireEvent.click(option);
      };
    test("does not render the actual Sidebar component", async () => {
      renderComponent();
      expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    });

  // ✅ Test: Renders all form fields correctly
  test("renders form fields correctly", () => {
    renderComponent();

    const labels = [
      /title/i,
      /description/i,
      /location/i,
      /work/i,
      /employmentType/i,
      /industry/i,
      /experience/i,
      /salary/i,
    ];

    labels.forEach((label) => {
      expect(screen.getByTestId(label)).toBeInTheDocument();
    });
  });

  // ✅ Test: Prevents submission when any field is empty
  test("displays validation errors when any field is empty", async () => {
    renderComponent();

    // Click the post button without filling the form
    const buttons = await screen.findAllByText(/post/i);
    await fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      const locationErrors = screen.getAllByText('location is required');
      expect(locationErrors.length).toBe(1);
      expect(screen.getByText(/workLocation is required/i)).toBeInTheDocument();    
      expect(screen.getByText(/employmentType is required/i)).toBeInTheDocument();
      expect(screen.getByText(/industry is required/i)).toBeInTheDocument();
      expect(screen.getByText(/experience is required/i)).toBeInTheDocument();
      expect(screen.getByText(/salary is required/i)).toBeInTheDocument();
    });

    // Ensure mutate is NOT called when validation fails
    expect(mockMutate).not.toHaveBeenCalled();
  });

  

 // ✅ Test: Successfully submits the form when all fields are filled
 test("submits the form with valid data", async () => {
    renderComponent();
    
    // Fill out all form fields
    fillForm();
  
  
    const buttons = await screen.findAllByText(/post/i);
    await fireEvent.click(buttons[1]); // Clicks the first matching element
    
      
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
  
      // Check the structure of the call argument
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          username: mockUsername,
          newJob: expect.objectContaining({
            title: "Software Engineer",
            description: "Develop and maintain software.",
            location: "Cairo",
            workLocation: "Remote",
            employmentType: "Full Time",
            industry: "Technology",
            experience: "Mid Level",
            salary: "10000",
          }),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });
  
  

  // ✅ Test: Displays success message after successful job posting
  test("displays success message after posting job", async () => {
    const successMock = jest.fn((data, options) => {  
        options?.onSuccess();
      });
  
      useMutation.mockReturnValue({
        mutate: successMock,
        isPending: false,
      });

    renderComponent();
    fillForm();
    const buttons = await screen.findAllByText(/post/i);
    await fireEvent.click(buttons[1]);
    await waitFor(() => {
        expect(successMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText(/job posted successfully/i)).toBeInTheDocument();
      });
  });

  // ✅ Test: Displays error message if job posting fails
  test("displays error message on job post failure", async () => {
    const errorMock = jest.fn((_, options) => {  
        options?.onError();
      });
  
      useMutation.mockReturnValue({
        mutate: errorMock,
        isPending: false,
      });
  
    renderComponent();
    fillForm();
    const buttons = await screen.findAllByText(/post/i);
    await fireEvent.click(buttons[1]);  
    await waitFor(() => {
      // Ensure the errorMock is called once
      expect(errorMock).toHaveBeenCalledTimes(1);
      // Check if the error message is displayed
      expect(screen.getByRole("alert")).toHaveTextContent("Error posting job");
    });
  });

  // ✅ Test: Calls the onBack function when the back button is clicked
  test("navigates back when back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByTestId(/ArrowBack/i);
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });
});
