import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlockedFollowersContainer from "../../app/components/modules/company-page-author/container/BlockedFollowersContainer";
import { fetchBlockedUsers, unblockUser } from "../../app/services/privacy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../app/services/privacy", () => ({
  fetchBlockedUsers: jest.fn(),
  unblockUser: jest.fn(),
}));

jest.mock("../../app/components/modules/company-page-author/presentation/FollowersList", () => {
  return function MockFollowersList({ followers, unblock }) {
    return (
      <div data-testid="followers-list">
        {followers.map((follower) => (
          <div key={follower.username}>
            <span>{follower.username}</span>
            <button onClick={() => unblock(follower.username)}>Unblock</button>
          </div>
        ))}
      </div>
    );
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe("BlockedFollowersContainer", () => {
  const companyUsername = "testCompany";

  const mockFollowers = [
    { username: "blockedUser1" },
    { username: "blockedUser2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BlockedFollowersContainer companyUsername={companyUsername} />
      </QueryClientProvider>
    );
  }

  test("fetches and displays blocked followers", async () => {
    fetchBlockedUsers.mockResolvedValue({ blockedUsers: mockFollowers });
    setup();
    await waitFor(() => {
      expect(fetchBlockedUsers).toHaveBeenCalledWith("", 1, 10, companyUsername);
      expect(screen.getByText("blockedUser1")).toBeInTheDocument();
      expect(screen.getByText("blockedUser2")).toBeInTheDocument();
    });
  });

  test("unblocks a user and updates the list", async () => {
    fetchBlockedUsers.mockResolvedValue({ blockedUsers: mockFollowers });
    unblockUser.mockResolvedValue({ success: true });
    setup();
    await waitFor(() => {
      expect(screen.getByText("blockedUser1")).toBeInTheDocument();
    });

    const unblockButton = screen.getAllByText("Unblock")[0];
    fireEvent.click(unblockButton);

    await waitFor(() => {
      expect(unblockUser).toHaveBeenCalledWith("blockedUser1", false, companyUsername);
      expect(screen.queryByText("blockedUser1")).not.toBeInTheDocument();
    });
  });

  test("handles fetchBlockedUsers failure", async () => {
    fetchBlockedUsers.mockRejectedValue(new Error("Network error"));
    setup();
    await waitFor(() => {
      expect(fetchBlockedUsers).toHaveBeenCalled();
    });

    expect(screen.queryByTestId("followers-list")).toBeInTheDocument(); 
  });

  test("handles unblockUser failure", async () => {
    fetchBlockedUsers.mockResolvedValue({ blockedUsers: mockFollowers });
    unblockUser.mockRejectedValue(new Error("Unblock failed"));
    setup();
    const unblockButton = await screen.findAllByText("Unblock");
    fireEvent.click(unblockButton[0]);

    await waitFor(() => {
      expect(unblockUser).toHaveBeenCalledWith("blockedUser1", false, companyUsername);
    });
    expect(screen.getByText("blockedUser1")).toBeInTheDocument();
  });
});
