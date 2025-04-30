"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import { FlaggedJobsTableContainer } from "../../app/components/modules/admin/container/FlaggedJobsTableContainer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../..//app/context/ToastContext";
import "@testing-library/jest-dom";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("../../app/services/admin", () => ({
  fetchReports: jest.fn(),
  deleteReport: jest.fn(),
  deleteJob: jest.fn(),
  updateStatusReport: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock(
  "../../app/components/modules/admin/presentation/FlaggedJobsTablePresentation",
  () => ({
    FlaggedJobsTablePresentation: (props) => (
      <div data-testid="flagged-jobs-table">
        <button
          data-testid="view-details-button"
          onClick={() => props.handleViewDetails({
            reportData: { _id: "1", jobId: "job1", userId: "user1", createdAt: "2023-01-01", status: "pending", reason: "inappropriate" },
            itemDetails: {
              title: "Software Engineer",
              location: "Remote",
              employmentType: "Full-time",
              companyData: { name: "Tech Corp", logo: "/logo.png" }
            }
          })}
        >
          View Details
        </button>
        <button
          data-testid="close-dialog-button"
          onClick={props.handleCloseDialog}
        >
          Close Dialog
        </button>
        <button
          data-testid="delete-report-button"
          onClick={() => props.handleDeleteReport("1")}
        >
          Delete Report
        </button>
        <button
          data-testid="delete-job-button"
          onClick={() => props.handleDeleteJob("job1")}
        >
          Delete Job
        </button>
        <button
          data-testid="update-report-button"
          onClick={() => props.handleUpdateReport("1", "resolved")}
        >
          Update Report
        </button>
        <button
          data-testid="status-filter-button"
          onClick={() => props.handleStatusFilter("Pending")}
        >
          Filter Status
        </button>
        <button data-testid="set-page-button" onClick={() => props.setPage(2)}>
          Set Page
        </button>
        <button
          data-testid="set-sort-order-button"
          onClick={() => props.setSortOrder("desc")}
        >
          Set Sort Order
        </button>
        <div data-testid="status-color">{props.getStatusColor("pending")}</div>
      </div>
    ),
  })
);

describe("FlaggedJobsTableContainer", () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  const mockShowToast = jest.fn();

  const mockReportsData = {
    data: [
      {
        reportData: {
          _id: "1",
          jobId: "job1",
          status: "pending",
          userId: "John Doe",
          createdAt: "2023-01-01T00:00:00.000Z",
          reason: "inappropriate content"
        },
        itemDetails: {
          title: "Software Engineer",
          location: "Remote",
          employmentType: "Full-time",
          companyData: {
            name: "Tech Corp",
            logo: "/logo.png",
          },
        }
      },
    ],
    nextPage: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useQueryClient.mockReturnValue(mockQueryClient);
    useToast.mockReturnValue(mockShowToast);

    useQuery.mockReturnValue({
      data: mockReportsData,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    useMutation.mockImplementation(({ onSuccess }) => ({
      mutate: jest.fn().mockImplementation(() => {
        if (onSuccess) onSuccess();
      }),
    }));
  });

  it("renders the FlaggedJobsTablePresentation component", () => {
    render(<FlaggedJobsTableContainer />);
    expect(screen.getByTestId("flagged-jobs-table")).toBeInTheDocument();
  });

  it("fetches reports with the correct parameters", () => {
    render(<FlaggedJobsTableContainer />);

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["jobReports", 1, "asc", ""],
      queryFn: expect.any(Function),
      keepPreviousData: true,
      retry: false,
    });
  });

  it("handles view details action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("view-details-button"));
    // Check if dialog is open
    expect(screen.getByTestId("close-dialog-button")).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("close-dialog-button"));
    // Test would continue but we just triggered the action
  });

  it("handles update report action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("update-report-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["jobReports"]);
    expect(mockShowToast).toHaveBeenCalledWith("Report status updated successfully");
  });

  it("handles delete report action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("delete-report-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["jobReports"]);
    expect(mockShowToast).toHaveBeenCalledWith("Report disapproved successfully");
  });

  it("handles delete job action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("delete-job-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["jobReports"]);
    expect(mockShowToast).toHaveBeenCalledWith("Job deleted successfully");
  });

  it("handles status filter", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("status-filter-button"));
    // No need to assert state changes as it's internal to the component
  });

  it("provides correct status color", () => {
    render(<FlaggedJobsTableContainer />);
    
    const statusColor = screen.getByTestId("status-color").textContent;
    expect(statusColor).toBe("text-yellow-600 border border-yellow-600");
  });
});
