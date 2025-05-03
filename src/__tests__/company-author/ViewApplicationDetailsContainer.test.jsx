import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewApplicationDetailsContainer from "../../app/components/modules/company-jobs/container/ViewApplicationDetailsContainer";
import { getApplication, updateApplication } from "../../app/services/companyManagement";
import { useToast } from "../../app/context/ToastContext";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("../../app/services/companyManagement", () => ({
    getApplication: jest.fn(),
    updateApplication: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
    useToast: jest.fn(),
}));

describe("ViewApplicationDetailsContainer", () => {
    const mockToast = jest.fn();
    const mockOnClose = jest.fn();
    const jobId = "job-123";
    const applicantId = "applicant-456";

    const mockApplication = {
        avatar: "avatar.jpg",
        name: "John Doe",
        location: "New York",
        email: "john@example.com",
        phone: "123-456-7890",
        applied_date: "2023-10-01",
        resume_url: "/mock/resume.pdf",
        status: "accepted",
        notes: "Initial review completed.",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useToast.mockReturnValue(mockToast);
        getApplication.mockResolvedValue(mockApplication);
    });

    test("fetches and displays application details", async () => {
        getApplication.mockResolvedValue(mockApplication);

        render(<ViewApplicationDetailsContainer jobId={jobId} applicantId={applicantId} onClose={mockOnClose} />);

        expect(screen.getAllByText(/loading.../i).length).toBeGreaterThan(0);

        await waitFor(() => {
            expect(getApplication).toHaveBeenCalledWith(jobId, applicantId);
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("New York")).toBeInTheDocument();
        });
    });

    test('calls updateApplication and shows success message when Save Changes is clicked', async () => {
      // Mock the success behavior of the updateApplication
      updateApplication.mockResolvedValue({}); // Simulate successful update
    
      // Render the component
      render(
        <ViewApplicationDetailsContainer
          jobId={jobId}
          applicantId={applicantId}
          onClose={mockOnClose}
        />
      );
    
      // Ensure the component initially shows the expected values
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("New York")).toBeInTheDocument();
      });
      // Now simulate the "Save Changes" button click
      fireEvent.click(screen.getByText('Save Changes'));
    
      // Wait for the update function to be called with the correct parameters
      await waitFor(() => {
        expect(updateApplication).toHaveBeenCalledWith(jobId, applicantId, {
          status: "accepted",  // Initial status value from mockApplication
          notes: "Initial review completed.", // Initial notes value from mockApplication
        });
        expect(mockToast).toHaveBeenCalledWith('Application updated successfully');
      });
    });
    

    test("handles API error gracefully", async () => {
        getApplication.mockRejectedValue(new Error("API Error"));

        render(<ViewApplicationDetailsContainer jobId={jobId} applicantId={applicantId} onClose={mockOnClose} />);

        await waitFor(() => {
            expect(getApplication).toHaveBeenCalledWith(jobId, applicantId);
            expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        });
    });
});