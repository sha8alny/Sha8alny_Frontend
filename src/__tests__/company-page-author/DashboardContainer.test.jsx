import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardContainer from "../../app/components/modules/company-page-author/container/DashboardContainer";
import { getCompany } from "@/app/services/companyManagement";
import { useRouter } from "next/navigation";


jest.mock("../../app/services/companyManagement", () => ({
  getCompany: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../app/components/modules/company-page-author/presentation/Dashboard", () => {
  return function MockDashboard({ company, goToPostsPage }) {
    return (
      <div data-testid="dashboard">
        {company && <p>{company.name}</p>}
        <button onClick={goToPostsPage}>Create Post</button>
      </div>
    );
  };
});

describe("DashboardContainer", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  test("renders company data after fetch", async () => {
    getCompany.mockResolvedValue({ name: "Test Company" });
    render(<DashboardContainer username="test-company" />);
    await waitFor(() => {
      expect(getCompany).toHaveBeenCalledWith("test-company");
      expect(screen.getByText("Test Company")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    getCompany.mockRejectedValue(new Error("Fetch failed"));
    render(<DashboardContainer username="test-company" />);
    await waitFor(() => {
      expect(getCompany).toHaveBeenCalled();
    });
  });

  test("navigates to posts page when button clicked", async () => {
    getCompany.mockResolvedValue({ name: "Test Company" });
    render(<DashboardContainer username="test-company" />);
    const button = await screen.findByText("Create Post");
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith("/company/test-company/admin/posts");
  });
});
