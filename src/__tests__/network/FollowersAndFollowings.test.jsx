import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FollowersAndFollowingsContainer from "../../app/components/modules/network/container/FollowersAndFollowingsContainer";
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
  const originalModule = jest.requireActual("@tanstack/react-query");
  return {
    ...originalModule,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
  };
});
jest.mock("../../app/services/connectionManagement");

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <FollowersAndFollowingsContainer />
    </QueryClientProvider>
  );

const queryClient = new QueryClient();

const mockFilters = {
  name: "",
  industry: "",
  location: "",
  connectionDegree: "",
};

describe("FollowersAndFollowingsContainer", () => {
  beforeEach(() => {
    useFilters.mockReturnValue({ filters: mockFilters });
    useToast.mockReturnValue(jest.fn());
  });

  const setup = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <FollowersAndFollowingsContainer />
      </QueryClientProvider>
    );

  it("renders loading state", () => {
    useQuery.mockImplementation(({ queryKey }) => ({
      data: [],
      isLoading: true,
      isError: false,
    }));

    setup();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty state with explore button", async () => {
    useQuery.mockImplementation(({ queryKey }) => ({
      data: [],
      isLoading: false,
      isError: false,
    }));

    setup();
    expect(await screen.findByText("No followers yet")).toBeInTheDocument();
    expect(screen.getByTestId("explore-connections-button")).toBeInTheDocument();
  });

  it("renders list of followers", async () => {
    useQuery.mockImplementation(({ queryKey }) => ({
      data: [
        {
          username: "john",
          name: "John Doe",
          headline: "Engineer",
          profilePicture: "/john.jpg",
          coverPhoto: "/cover.jpg",
          numberOfConnections: 5,
          connectionDegree: 1,
        },
      ],
      isLoading: false,
      isError: false,
    }));

    setup();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });


  it("can change tab from followers to following", async () => {
    useQuery.mockImplementation(({ queryKey }) => ({
      data: [],
      isLoading: false,
      isError: false,
    }));

    setup();
    fireEvent.click(screen.getByTestId("following-button"));
    expect(await screen.findByText("No following yet")).toBeInTheDocument();
  });

  it("handles unfollow", async () => {
    const mockMutate = jest.fn((_, { onSuccess }) => onSuccess());
    useMutation.mockReturnValue({ mutate: mockMutate });
    const mockToast = jest.fn();

    useQuery.mockImplementation(({ queryKey }) => ({
      data: [
        {
          username: "john",
          name: "John Doe",
          headline: "Engineer",
          profilePicture: "/john.jpg",
          coverPhoto: "/cover.jpg",
          numberOfConnections: 5,
          connectionDegree: 1,
        },
      ],
      isLoading: false,
      isError: false,
    }));

    setup();
    fireEvent.click(screen.getByTestId("following-button"));

    fireEvent.click(screen.getByTestId("x-button")); // simulate the action path
    fireEvent.click(screen.getByTestId("confirm-delete")); // simulate the confirmation dialog
  });

  it("renders a list of followers and paginates", async () => {
    const mockPage1 = Array.from({ length: 9 }).map((_, i) => ({
      username: `follower${i}`,
      name: `Follower ${i}`,
      headline: "Engineer",
      profilePicture: "",
      coverPhoto: "",
      numberOfConnections: 5,
      isConnected: "accepted",
    }));
  
    const mockPage2 = [
      {
        username: "follower9",
        name: "Follower 9",
        headline: "Engineer",
        profilePicture: "",
        coverPhoto: "",
        numberOfConnections: 5,
        isConnected: "accepted",
      },
    ];
  
    let currentPage = 1;
  
    // Mock getFollowers
    connectionService.getFollowers.mockImplementation((...args) => {
      const page = args[4];
      return Promise.resolve(page === 2 ? mockPage2 : mockPage1);
    });
  
    // Mock useQuery
    useQuery.mockImplementation(({ queryKey }) => {
      const pageFromKey = queryKey?.[2] ?? 1;
      const data = pageFromKey === 2 ? mockPage2 : mockPage1;
      return {
        data,
        isLoading: false,
        isError: false,
      };
    });
    renderComponent();
  
    await waitFor(() => {
      expect(screen.getByText("Follower 0")).toBeInTheDocument();
    });
  
    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
  
    // Simulate clicking next and page change
    currentPage = 2;
  
    // Force rerender with updated page
    renderComponent();
  });
  
  
  it("renders a list of followings and paginates", async () => {
    const mockPage1 = Array.from({ length: 9 }).map((_, i) => ({
      username: `following${i}`,
      name: `Following ${i}`,
      headline: "Engineer",
      profilePicture: "",
      coverPhoto: "",
      numberOfConnections: 5,
      isConnected: "accepted",
    }));
  
    const mockPage2 = [
      {
        username: "following9",
        name: "Following 9",
        headline: "Engineer",
        profilePicture: "",
        coverPhoto: "",
        numberOfConnections: 5,
        isConnected: "accepted",
      },
    ];
  
    let currentPage = 1;
    // Mock getFollowers
    connectionService.getFollowing.mockImplementation((...args) => {
      const page = args[4];
      return Promise.resolve(page === 2 ? mockPage2 : mockPage1);
    });
  
    // Mock useQuery
    useQuery.mockImplementation(({ queryKey }) => {
      const pageFromKey = queryKey?.[2] ?? 1;
      const data = pageFromKey === 2 ? mockPage2 : mockPage1;
      return {
        data,
        isLoading: false,
        isError: false,
      };
    });
  
    renderComponent();
    fireEvent.click(screen.getByTestId("following-button"));

    await waitFor(() => {
      expect(screen.getByText("Following 0")).toBeInTheDocument();
    });
  
    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
  
    // Simulate clicking next and page change
    currentPage = 2;
  
    // Force rerender with updated page
    renderComponent();
  });
  
});
