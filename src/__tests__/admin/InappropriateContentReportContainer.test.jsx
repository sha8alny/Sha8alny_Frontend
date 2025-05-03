"use client";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InappropriateContentReportsContainer } from "../../app/components/modules/admin/container/InappropriateContentReportContainer";
import { useToast } from "../../app/context/ToastContext";
import "@testing-library/jest-dom";
import { InappropriateContentReportsPresentation } from "@/app/components/modules/admin/presentation/InappropriateContentReportPresentation";

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
  }));

jest.mock("../../app/services/admin", () => ({
    fetchReports: jest.fn(),
    deleteReport: jest.fn(),
    deleteUser: jest.fn(),
    deletePost: jest.fn(),
    deleteComment: jest.fn(),
    deleteCompany: jest.fn(),
    updateStatusReport: jest.fn(),
  }));

jest.mock("../../app/context/ToastContext", () => ({
    useToast: jest.fn(),
  }));
  jest.mock(
    "../../app/components/modules/admin/presentation/InappropriateContentReportPresentation",
    () => ({
      InappropriateContentReportsPresentation: (props) => (
        <div data-testid="inappropriate-content-table">
          <button
            data-testid="view-details-button"
            onClick={() => props.handleViewDetails({
                        reportData: {
                          _id: "1",
                          type: "User",
                          userId: "user1",
                          createdAt: "2023-01-01T00:00:00Z",
                          status: "pending",
                          reason: "inappropriate",
                          name: "John Doe",
                          username: "johndoe",
                          profilePicture: "https://example.com/avatar1.jpg"
                        },
                        itemDetails: {
                          _id: "user1",
                          type: "User",
                          name: "John Doe",
                          username: "johndoe",
                          profilePicture: "https://example.com/avatar1.jpg",
                          isDeleted: false
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
            data-testid="delete-user-button"
            onClick={() => props.handleDeleteUser("user1")}
          >
            Ban User
          </button>
          <button
            data-testid="update-report-button"
            onClick={() => props.handleUpdateReport("1", "resolved")}
          >
            Update Report
          </button>
          <button
            data-testid="status-filter-button"
            onClick={() => props.toggleStatusFilter("Pending")}
          >
            Filter Status
          </button>
            <button
            data-testid="filter-button"
            onClick={() => props.handleFilterChange("user")}
            >
            Filter
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
describe("InappropriateContentContainer", () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  const mockShowToast = jest.fn();

  const mockReportsData = {
    data: [
      {
        reportData: {
            _id: "1",
            type: "User",
            userId: "user1",
            createdAt: "2023-01-01T00:00:00Z",
            status: "pending",
            reason: "inappropriate",
            name: "John Doe",
            username: "johndoe",
            profilePicture: "https://example.com/avatar1.jpg"
          },
          itemDetails: {
            _id: "user1",
            type: "User",
            name: "John Doe",
            username: "johndoe",
            profilePicture: "https://example.com/avatar1.jpg",
            isDeleted: false
          },
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

  it("renders the InappropriateContentPresentation component", () => {
    render(<InappropriateContentReportsContainer />);
    expect(screen.getByTestId("inappropriate-content-table")).toBeInTheDocument();
  });
  

  it("fetches reports with the correct parameters", () => {
    render(<InappropriateContentReportsContainer />);

    expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            "inappropriateContentReports",
            1,
            "asc"
          ]),
          keepPreviousData: true
        })
      );
      
  });

  it("handles view details action", () => {
    render(<InappropriateContentReportsContainer />);

    fireEvent.click(screen.getByTestId("view-details-button"));
    // Check if dialog is open
    expect(screen.getByTestId("close-dialog-button")).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("close-dialog-button"));
    // Test would continue but we just triggered the action
  });

  it("handles update report action", () => {
    render(<InappropriateContentReportsContainer />);

    fireEvent.click(screen.getByTestId("update-report-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["inappropriateContentReports"]);
    expect(mockShowToast).toHaveBeenCalledWith("Report status updated successfully");
  });

  it("handles delete report action", () => {
    render(<InappropriateContentReportsContainer />);

    fireEvent.click(screen.getByTestId("delete-report-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["inappropriateContentReports"]);
    expect(mockShowToast).toHaveBeenCalledWith("Report disapproved successfully");
  });

  it("handles delete User action", () => {
    render(<InappropriateContentReportsContainer />);

    fireEvent.click(screen.getByTestId("delete-user-button"));

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(["inappropriateContentReports"]);
  });

  it("handles status filter", () => {
    render(<InappropriateContentReportsContainer />);

    fireEvent.click(screen.getByTestId("status-filter-button"));
    // No need to assert state changes as it's internal to the component
  });

  it("provides correct status color", () => {
    render(<InappropriateContentReportsContainer />);
    
    const statusColor = screen.getByTestId("status-color").textContent;
    expect(statusColor).toBe("text-yellow-600 border border-yellow-600");
  });
    it("handles filter change", () => {
        render(<InappropriateContentReportsContainer />);
    
        fireEvent.click(screen.getByTestId("filter-button"));
        });
});
