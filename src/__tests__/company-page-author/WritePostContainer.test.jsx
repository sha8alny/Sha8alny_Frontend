import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import WritePostContainer from "@/app/components/modules/company-page-author/container/WritePostContainer";

describe("WritePostContainer",()=>{
    const mockOnPostSubmit = jest.fn();
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => "mocked-url");
        mockOnPostSubmit.mockClear();
    });

    test("renders WritePostContainer correctly", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        expect(screen.getByPlaceholderText("Start a post")).toBeInTheDocument();
    });

    test("updates text input when typing", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        const textInput = screen.getByPlaceholderText("Start a post");
        
        fireEvent.change(textInput, { target: { value: "Hello World!" } });
        
        expect(textInput.value).toBe("Hello World!");
    });

    test("handles image upload", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        
        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const input = screen.getByTestId("upload-file");
        
        fireEvent.change(input, { target: { files: [file] } });
        
        expect(input.files[0].name).toBe("example.png");
    });

    test("handles video upload", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        
        const file = new File(["dummy content"], "video.mp4", { type: "video/mp4" });
        const input = screen.getByTestId("upload-video");
        
        fireEvent.change(input, { target: { files: [file] } });
        
        expect(input.files[0].name).toBe("video.mp4");
    });

    test("submits a post when text is entered", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        
        const textInput = screen.getByPlaceholderText("Start a post");
        fireEvent.change(textInput, { target: { value: "New Post Content" } });

        const submitButton = screen.getByText("Post");
        fireEvent.click(submitButton);

        expect(mockOnPostSubmit).toHaveBeenCalledWith({ text: "New Post Content",imageUrl:null,videoUrl:null});
    });

    test("submits an article when text is entered",()=>{
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        const openModalButton = screen.getByTestId("write-post-modal"); // Adjust if needed
        fireEvent.click(openModalButton);

        const articleTextarea = screen.getByPlaceholderText("Start writing your article...");
        fireEvent.change(articleTextarea, { target: { value: "My Article Content" } });

        const publishButton = screen.getByText("Publish");
        fireEvent.click(publishButton);

        expect(mockOnPostSubmit).toHaveBeenCalledWith({text: "My Article Content",isArticle: true,});
    });

    test("opens and closes the article modal", () => {
        render(<WritePostContainer onPostSubmit={mockOnPostSubmit} logoPreview="" />);
        
        const openModalButton = screen.getByTestId("write-post-modal");
        fireEvent.click(openModalButton);
        
        expect(screen.getByText("Write an article")).toBeInTheDocument();
        
        const closeModalButton = screen.getByText("Cancel");
        fireEvent.click(closeModalButton);
        
        expect(screen.queryByText("Write an article")).not.toBeInTheDocument();
    });

})