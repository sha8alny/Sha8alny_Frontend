import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostPageContainer from "../../app/components/modules/company-page-author/container/PostPageContainer";
import { createPost } from "../../app/services/post";
import { getCompany } from "../../app/services/companyManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../app/services/post", () => ({
  createPost: jest.fn(),
}));

jest.mock("../../app/services/companyManagement", () => ({
  getCompany: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush,}),
  usePathname: () => "/mock-path",
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const mockCompanyData = {
  name: "Siemens",
  industry: "Engineering",
  logo: "https://example.com/logo.png",
};

describe("PostPageContainer", () => {
  const username = "Siemens";
  const logo = "https://example.com/logo.png";

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    jest.clearAllMocks();
    getCompany.mockResolvedValue(mockCompanyData);
  });

  function setup() {
    return render(
      <QueryClientProvider client={createTestQueryClient()}>
        <PostPageContainer username={username} logo={logo} />
      </QueryClientProvider>
    );
  }

  test("fetches and sets company data", async () => {
    setup();
    await waitFor(() => {
      expect(getCompany).toHaveBeenCalledWith(username);
    });
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  test("handles error while fetching company", async () => {
    getCompany.mockRejectedValueOnce(new Error("Fetch error"));
    setup();
    await waitFor(() => {
      expect(getCompany).toHaveBeenCalledWith(username);
    });
    expect(screen.queryByText("Start a post")).not.toBeInTheDocument();
  });

  test("uploads logo and updates preview", async () => {
    setup();
    const file = new File(["dummy"], "logo.png", { type: "image/png" });
    const logoInput = await screen.findByTestId("upload-image");
    fireEvent.change(logoInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
  });

  test("handles post submission failure", async () => {
    createPost.mockRejectedValue(new Error("Post failed"));

    setup();

    const textInput = await screen.findByPlaceholderText("Start a post");
    fireEvent.change(textInput, { target: { value: "Will fail" } });

    const postButton = screen.getByText("Post");
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(createPost).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
