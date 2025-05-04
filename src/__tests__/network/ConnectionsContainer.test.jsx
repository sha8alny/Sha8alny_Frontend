import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConnectionsContainer from "../../app/components/modules/network/container/ConnectionsContainer";
import * as connectionService from "../../app/services/connectionManagement";
import { useToast } from "@/app/context/ToastContext";
import { useFilters } from "@/app/context/NetworkFilterContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

// Mock contexts
jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock("../../app/context/NetworkFilterContext", () => ({
  useFilters: jest.fn(),
}));

// Mock service methods
jest.mock("../../app/services/connectionManagement", () => ({
  getConnections: jest.fn(),
  removeConnection: jest.fn(),
  getConnectionMutuals: jest.fn(),
}));

const queryClient = new QueryClient();

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ConnectionsContainer />
    </QueryClientProvider>
  );

describe("ConnectionsContainer", () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useToast.mockReturnValue(mockToast);
    useFilters.mockReturnValue({
      filters: {
        name: "",
        industry: "",
        location: "",
        connectionDegree: "",
      },
    });
  });

  it("shows loading state initially", async () => {
    connectionService.getConnections.mockReturnValueOnce([]);

    renderComponent();

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("shows empty state when no connections", async () => {
    connectionService.getConnections.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("No connections yet")).toBeInTheDocument();
    });

    const exploreBtn = screen.getByTestId("explore-connections-button");
    expect(exploreBtn).toBeInTheDocument();
  });

  it("renders a list of connections and paginates", async () => {
    const mockPage1 = Array.from({ length: 9 }).map((_, i) => ({
      username: `user${i}`,
      name: `User ${i}`,
      headline: "Engineer",
      profilePicture: "",
      coverPhoto: "",
      numberOfConnections: 10,
      isConnected: "accepted",
    }));
  
    const mockPage2 = [
      {
        username: "user9",
        name: "User 9",
        headline: "Engineer",
        profilePicture: "",
        coverPhoto: "",
        numberOfConnections: 10,
        isConnected: "accepted",
      },
    ];
  
    // Mocking based on page argument
    connectionService.getConnections.mockImplementation((...args) => {
      const page = args[4]; // filters.name, filters.industry, filters.location, filters.connectionDegree, page
      return Promise.resolve(page === 2 ? mockPage2 : mockPage1);
    });
  
    renderComponent();
  
    await waitFor(() => {
      expect(screen.getByText("User 0")).toBeInTheDocument();
    });
  
    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
  });
  
  it("removes a connection successfully", async () => {
    const mockConnections = [
      {
        username: "user1",
        name: "User One",
        headline: "Engineer",
        profilePicture: "",
        coverPhoto: "",
        numberOfConnections: 5,
        isConnected: "accepted",
        mutualConnections: {count: 3} , 
      },
    ];

    connectionService.getConnections.mockResolvedValue(mockConnections);
    connectionService.removeConnection.mockResolvedValue({ success: true });

    renderComponent();

    await waitFor(() => {
        expect(screen.getByText("User One")).toBeInTheDocument(); 
      });

    fireEvent.click(screen.getByTestId("x-button")); // simulate the action path
    fireEvent.click(screen.getByTestId("confirm-delete")); // simulate the confirmation dialog
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Connection removed successfully");
    });
  });

  it("handles removeConnection error", async () => {
    const mockConnections = [
      {
        username: "user1",
        name: "User One",
        headline: "Engineer",
        profilePicture: "",
        coverPhoto: "",
        numberOfConnections: 5,
        isConnected: "accepted",
        mutualConnections: { count: 3 }, 
      },
    ];

    connectionService.getConnections.mockResolvedValue(mockConnections);
    connectionService.removeConnection.mockRejectedValue(new Error("Fail"));

    renderComponent();

    await waitFor(() => {
        expect(screen.getByText("User One")).toBeInTheDocument(); 
      });
      

    // Simulate remove
    fireEvent.click(screen.getByTestId("x-button"));
    // Simulate dialog confirmation
    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Error removing connection", false);
    });
  });
});
