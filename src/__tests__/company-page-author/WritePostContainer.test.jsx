import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WritePostContainer from "@/app/components/modules/company-page-author/container/WritePostContainer";

describe("WritePostContainer", () => {
  const mockOnPostSubmit = jest.fn();

  const mockCompany = {
    name: "Test Company",
    industry: "Software",
    logo: "company-logo-url",
  };

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
    mockOnPostSubmit.mockClear();
  });

  test("renders WritePostContainer correctly", () => {
    render(
      <WritePostContainer
        onPostSubmit={mockOnPostSubmit}
        company={mockCompany}
        logoPreview=""
      />
    );
    expect(screen.getByPlaceholderText("Start a post")).toBeInTheDocument();
  });

  test("updates text input when typing", () => {
    render(
      <WritePostContainer
        onPostSubmit={mockOnPostSubmit}
        company={mockCompany}
        logoPreview=""
      />
    );

    const textInput = screen.getByPlaceholderText("Start a post");
    fireEvent.change(textInput, { target: { value: "Hello World!" } });

    expect(textInput.value).toBe("Hello World!");
  });

  test("handles image upload", () => {
    render(
      <WritePostContainer
        onPostSubmit={mockOnPostSubmit}
        company={mockCompany}
        logoPreview=""
      />
    );

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    const imageInput = screen.getByTestId("upload-image");
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files[0].name).toBe("example.png");
  });

  test("handles video upload", () => {
    render(
      <WritePostContainer
        onPostSubmit={mockOnPostSubmit}
        company={mockCompany}
        logoPreview=""
      />
    );

    const file = new File(["dummy content"], "video.mp4", {
      type: "video/mp4",
    });

    const videoInput = screen.getByTestId("upload-video");
    fireEvent.change(videoInput, { target: { files: [file] } });

    expect(videoInput.files[0].name).toBe("video.mp4");
  });

  test("submits a post when text is entered", () => {
    render(
      <WritePostContainer
        onPostSubmit={mockOnPostSubmit}
        company={mockCompany}
        logoPreview=""
      />
    );

    const textInput = screen.getByPlaceholderText("Start a post");
    fireEvent.change(textInput, { target: { value: "New Post Content" } });

    const submitButton = screen.getByText("Post");
    fireEvent.click(submitButton);

    expect(mockOnPostSubmit).toHaveBeenCalled();
    expect(mockOnPostSubmit.mock.calls[0][0]).toBeInstanceOf(FormData);
    expect(mockOnPostSubmit.mock.calls[0][1]).toMatchObject({
      text: "New Post Content",
      fullName: "Test Company",
    });
  });
});
