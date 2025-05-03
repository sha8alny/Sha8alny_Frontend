import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AnalyticsContainer from "@/app/components/modules/company-page-author/container/AnalyticsContainer";
import { getAnalytics } from "../../app/services/companyManagement";

jest.mock("../../app/services/companyManagement", () => ({
  getAnalytics: jest.fn(),
}));

jest.mock("../../app/components/modules/company-page-author/presentation/Analytics", () => {
  return function MockAnalytics({ analytics }) {
    return (
      <div data-testid="mock-analytics">
        {analytics ? `Analytics Loaded: ${analytics.views}` : "Loading..."}
      </div>
    );
  };
});

describe("AnalyticsContainer", () => {
  const mockUsername = "exampleCompany";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders and fetches analytics data", async () => {
    getAnalytics.mockResolvedValue({ views: 1234 });
    render(<AnalyticsContainer companyUsername={mockUsername} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(getAnalytics).toHaveBeenCalledWith(mockUsername);
      expect(screen.getByText("Analytics Loaded: 1234")).toBeInTheDocument();
    });
  });

  test("handles analytics fetch failure", async () => {
    getAnalytics.mockRejectedValue(new Error("Network error"));
    render(<AnalyticsContainer companyUsername={mockUsername} />);
    await waitFor(() => {
      expect(getAnalytics).toHaveBeenCalledWith(mockUsername);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  test("does not fetch analytics if no username is provided", async () => {
    render(<AnalyticsContainer companyUsername={""} />);
    expect(getAnalytics).not.toHaveBeenCalled();
  });
});
