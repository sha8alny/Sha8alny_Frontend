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
          onClick={() => props.handleViewDetails({ _id: "1", jobId: "job1" })}
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
          data-testid="update-report-button"
          onClick={() => props.handleUpdateReport("1", "approved")}
        >
          Update Report
        </button>
        <button
          data-testid="toggle-status-button"
          onClick={() => props.toggleStatusFilter("Pending")}
        >
          Toggle Status
        </button>
        <button data-testid="set-page-button" onClick={() => props.setPage(2)}>
          Set Page
        </button>
        <button
          data-testid="set-sort-order-button"
          onClick={() => props.setSortOrder("des")}
        >
          Set Sort Order
        </button>
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
        _id: "1",
        jobId: "job1",
        title: "Software Engineer",
        companyData: {
          name: "Tech Corp",
          logo: "/logo.png",
        },
        status: "pending",
        accountName: "John Doe",
        createdAt: "2023-01-01T00:00:00.000Z",
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
      queryKey: ["jobReports", 1, "asc", []],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });
  });

  it("handles view details action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("view-details-button"));

    fireEvent.click(screen.getByTestId("close-dialog-button"));
  });

  it("handles update report action", () => {
    render(<FlaggedJobsTableContainer />);

    fireEvent.click(screen.getByTestId("update-report-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith([
      "jobReports",
    ]);
    expect(mockShowToast).toHaveBeenCalledWith(
      "Report status updated successfully"
    );
  });
});
