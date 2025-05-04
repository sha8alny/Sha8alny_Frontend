import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PendingContainer from "../../app/components/modules/network/container/PendingContainer";
import { useFilters } from "@/app/context/NetworkFilterContext";
import { useToast } from "@/app/context/ToastContext";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as connectionService from "../../app/services/connectionManagement";
import "@testing-library/jest-dom";

// Mocks
jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock("../../app/context/NetworkFilterContext", () => ({
  useFilters: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const original = jest.requireActual("@tanstack/react-query");
  return {
    ...original,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
  };
});

jest.mock("../../app/services/connectionManagement");

const queryClient = new QueryClient();
const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <PendingContainer />
    </QueryClientProvider>
  );

const mockFilters = {
  name: "",
  industry: "",
  location: "",
  connectionDegree: "",
};

describe("PendingContainer", () => {
  beforeEach(() => {
    useFilters.mockReturnValue({ filters: mockFilters });
    useToast.mockReturnValue(jest.fn());
  });

  it("renders loading state", () => {
    useQuery.mockImplementation(() => ({
      data: [],
      isLoading: true,
      isError: false,
    }));

    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty received and sent tabs", async () => {
    useQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      isError: false,
    }));

    renderComponent();

    expect(await screen.findByText("No received requests yet")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sent-button"));
    expect(await screen.findByText("No sent requests yet")).toBeInTheDocument();
  });

  it("renders received requests", async () => {
    useQuery.mockImplementation(({ queryKey }) => ({
      data: [
        {
          username: "user1",
          name: "User One",
          headline: "Developer",
          profilePicture: "",
          coverPhoto: "",
          numberOfConnections: 2,
        },
      ],
      isLoading: false,
      isError: false,
    }));

    renderComponent();
    expect(await screen.findByText("User One")).toBeInTheDocument();
  });

  it("switches to sent tab and renders sent requests", async () => {
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "sent-requests") {
        return {
          data: [
            {
              username: "user2",
              name: "User Two",
              headline: "Designer",
              profilePicture: "",
              coverPhoto: "",
              numberOfConnections: 4,
            },
          ],
          isLoading: false,
          isError: false,
        };
      }
      return { data: [], isLoading: false, isError: false };
    });

    renderComponent();
    fireEvent.click(screen.getByTestId("sent-button"));
  });

  it("accepts a received request", async () => {
    const mockMutate = jest.fn((_, { onSuccess }) => onSuccess());
    useMutation.mockReturnValue({ mutate: mockMutate });

    useQuery.mockImplementation(() => ({
      data: [
        {
          username: "user3",
          name: "User Three",
          headline: "Scientist",
          profilePicture: "",
          coverPhoto: "",
          numberOfConnections: 3,
        },
      ],
      isLoading: false,
      isError: false,
    }));

    renderComponent();
    fireEvent.click(screen.getByText("Accept"));
    expect(mockMutate).toHaveBeenCalled();
  });

  it("declines a received request", async () => {
    const mockMutate = jest.fn((_, { onSuccess }) => onSuccess());
    useMutation.mockReturnValue({ mutate: mockMutate });

    useQuery.mockImplementation(() => ({
      data: [
        {
          username: "user4",
          name: "User Four",
          headline: "Manager",
          profilePicture: "",
          coverPhoto: "",
          numberOfConnections: 7,
        },
      ],
      isLoading: false,
      isError: false,
    }));

    renderComponent();
    fireEvent.click(screen.getByTestId("x-button"));
    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(mockMutate).toHaveBeenCalled();
  });

  it("cancels a sent request", async () => {
    const mockMutate = jest.fn((_, { onSuccess }) => onSuccess());
    useMutation.mockReturnValue({ mutate: mockMutate });
  
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "sent") {
        return {
          data: [
            {
              username: "user5",
              name: "User Five",
              headline: "Analyst",
              profilePicture: "",
              coverPhoto: "",
              numberOfConnections: 5,
            },
          ],
          isLoading: false,
          isError: false,
        };
      }
      if (queryKey[0] === "received") {
        return {
          data: [],
          isLoading: false,
          isError: false,
        };
      }
      return { data: [], isLoading: false, isError: false };
    });
  
    renderComponent();
  
    // Switch to the 'Sent' tab
    fireEvent.click(screen.getByTestId("sent-button"));
  
    // Click cancel (X) button
    fireEvent.click(await screen.findByTestId("x-button"));
  
    // Confirm deletion in dialog
    fireEvent.click(screen.getByTestId("confirm-delete"));
  
    // Expect mutation to be called
    expect(mockMutate).toHaveBeenCalled();
  });
  
});
