import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyAdminContentContainer from "../../app/components/modules/company-page-author/container/CompanyAdminContentContainer";
import { getCompany } from "../../app/services/companyManagement";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../../app/services/companyManagement", () => ({
  getCompany: jest.fn(),
}));

jest.mock("../../app/components/modules/company-page-author/presentation/CompanyAdminContent", () => {
    return function MockCompanyAdminContent(props) {
      return (
        <div data-testid="admin-content">
          {props.company && <span data-testid="company">{props.company.name || props.company}</span>}
          <button onClick={props.toggleSidebar}>Toggle Sidebar</button>
          <button onClick={props.toggleAnalytics}>Toggle Analytics</button>
          <button onClick={props.onClick}>Go to Business</button>
        </div>
      );
    };
  });
  

describe("CompanyAdminContentContainer", () => {
  const mockPush = jest.fn();
  const username = "test-company";

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ username });
    useSearchParams.mockReturnValue({
      get: jest.fn((key) => (key === "logo" ? "logo.png" : null)),
    });
    useRouter.mockReturnValue({ push: mockPush });
  });

  test("renders and fetches company data", async () => {
    getCompany.mockResolvedValue({ name: "Test Company", isOwner: true });
    render(
      <CompanyAdminContentContainer>
        <p>Child Content</p>
      </CompanyAdminContentContainer>
    );
    expect(screen.getByTestId("admin-content")).toBeInTheDocument();

    await waitFor(() => {
      expect(getCompany).toHaveBeenCalledWith(username);
      expect(screen.getByText("Test Company")).toBeInTheDocument();
    });
  });

  test("renders with company = notFound when getCompany fails", async () => {
    getCompany.mockRejectedValue(new Error("Network error"));
    render(<CompanyAdminContentContainer />);
    await waitFor(() => {
      expect(getCompany).toHaveBeenCalled();
      expect(screen.getByText("notFound")).toBeInTheDocument();
    });
  });

  test("handles notOwner response", async () => {
    getCompany.mockResolvedValue({ isOwner: null });
    render(<CompanyAdminContentContainer />);
    await waitFor(() => {
      expect(screen.getByText("notOwner")).toBeInTheDocument();
    });
  });

  test("toggles sidebar and analytics", async () => {
    getCompany.mockResolvedValue({ name: "Test Company", isOwner: true });
    render(<CompanyAdminContentContainer />);
    await screen.findByText("Test Company");

    const toggleSidebar = screen.getByText("Toggle Sidebar");
    const toggleAnalytics = screen.getByText("Toggle Analytics");

    fireEvent.click(toggleSidebar);
    fireEvent.click(toggleAnalytics);
  });

  test("navigates to business page", async () => {
    getCompany.mockResolvedValue({ name: "Test Company", isOwner: true });

    render(<CompanyAdminContentContainer />);

    const button = await screen.findByText("Go to Business");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/business/");
  });
});
