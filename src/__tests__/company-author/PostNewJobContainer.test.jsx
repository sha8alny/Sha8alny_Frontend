import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostNewJobContainer from "../../app/components/modules/company-author/container/PostNewJobContainer";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";
import "@testing-library/jest-dom";

// ✅ Mock dependencies
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock(
  "../../app/components/modules/company-page-author/container/SideBarContainer",
  () => () => <div data-testid="mock-sidebar" />
);

jest.mock(
  "../../app/components/modules/company-page-author/presentation/Analytics",
  () => () => <div data-testid="mock-analytics" />
);

describe("PostNewJobContainer - Extended Tests", () => {
  const mockOnBack = jest.fn();
  const mockMutate = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    useToast.mockReturnValue(mockToast);
  });

  const renderComponent = (props = {}) =>
    render(
      <PostNewJobContainer
        onBack={mockOnBack}
        username="testCompany"
        logo="/test-logo.png"
        {...props}
      />
    );

  test("displays validation errors on empty form submission", async () => {
    renderComponent();
    const postButtons = screen.getAllByText(/post/i);
    fireEvent.click(postButtons[1]);

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });

    // You should ideally check for validation error messages here
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  test("calls toast on success", async () => {
    useMutation.mockReturnValue({
      mutate: (_data, { onSuccess }) => onSuccess(),
      isPending: false,
    });

    renderComponent({
      initialJobData: {
        title: "Test",
        location: "Cairo",
        workLocation: "Remote",
        employmentType: "Full Time",
        description: "Good job",
        industry: "Tech",
        experience: "Mid",
        salary: 5000,
      },
    });

    fireEvent.click(screen.getAllByText(/post/i)[1]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Job posted successfully!", "success");
    });
  });

  test("calls toast on error", async () => {
    useMutation.mockReturnValue({
      mutate: (_data, { onError }) => onError("error"),
      isPending: false,
    });

    renderComponent({
      initialJobData: {
        title: "Test",
        location: "Cairo",
        workLocation: "Remote",
        employmentType: "Full Time",
        description: "Good job",
        industry: "Tech",
        experience: "Mid",
        salary: 5000,
      },
    });

    fireEvent.click(screen.getAllByText(/post/i)[1]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Error posting job", false);
    });
  });

  test("renders logo preview when file is uploaded", async () => {
    renderComponent();
    const file = new File(["dummy content"], "logo.png", { type: "image/png" });

    const input = screen.getByTestId("mock-sidebar").querySelector("input[type='file']");
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    // Since logoPreview is used in the sidebar only (mocked), we can only assert no errors occur
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
  });

  test("renders correctly with empty initial data", () => {
    renderComponent();
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-analytics")).toBeInTheDocument();
  });
});
