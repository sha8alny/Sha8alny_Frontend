import { render, screen , fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostPageContainer from "../../app/components/modules/company-page-author/container/PostPageContainer";
import { createPost } from "../../app/services/post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../app/services/post", ()=>({
    createPost: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
}));

const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });  

describe("PostPageContainer",()=>{
    const mockUsername = "Siemens";
    const mockLogo = "https://example.com/logo.png";
    
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
        jest.clearAllMocks();
    });

    test("renders PostPageContainer with sidebar, post input, and analytics", () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <PostPageContainer username={mockUsername} logo={mockLogo} />
            </QueryClientProvider>);

        expect(screen.getByText(mockUsername)).toBeInTheDocument(); 
        expect(screen.getByText("Post")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Analytics" })).toBeInTheDocument();
    });

    test("uploads a new logo and updates the preview", () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <PostPageContainer username={mockUsername} logo={mockLogo} />
            </QueryClientProvider>);

        const file = new File(["dummy content"], "logo.png", { type: "image/png" });
        const logoInput = screen.getByTestId("upload-logo");

        fireEvent.change(logoInput, { target: { files: [file] } });

        waitFor(() => {
            expect(screen.getByAltText("Company Logo")).toHaveAttribute("src", expect.stringContaining("blob:")); 
        });
    });

    test("submits a new post successfully", async () => {
        createPost.mockResolvedValue({
            text: "New Post",
            imageUrl: null,
            videoUrl: null,
        });

        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <PostPageContainer username={mockUsername} logo={mockLogo} />
            </QueryClientProvider>);
        
        const textInput = screen.getByPlaceholderText("Start a post");
        fireEvent.change(textInput, { target: { value: "New Post" } });

        const postButton = screen.getByText("Post");
        fireEvent.click(postButton);

        await waitFor(() => {
            expect(createPost).toHaveBeenCalledWith({ text: "New Post", imageUrl: null, videoUrl: null });
        });

        await waitFor(() => {
            expect(screen.getByText("New Post")).toBeInTheDocument();
        });
    });

    test("handles post submission failure", async () => {
        createPost.mockRejectedValue(new Error("Failed to create post"));

        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <PostPageContainer username={mockUsername} logo={mockLogo} />
            </QueryClientProvider>);

        const textInput = screen.getByPlaceholderText("Start a post");
        fireEvent.change(textInput, { target: { value: "Error Post" } });

        const postButton = screen.getByText("Post");
        fireEvent.click(postButton);

        await waitFor(() => {
            expect(createPost).toHaveBeenCalledWith({ text: "Error Post", imageUrl: null, videoUrl: null });
        });
        expect(screen.queryByText("Error Post")).not.toBeInTheDocument();
    });

});