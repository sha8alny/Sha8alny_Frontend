import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsNavbarContainer from "../../app/components/modules/settings/container/SettingsNavbarContainer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SettingsNavbarContainer and SettingsNavbarPresentation Integration", () => {
  let useQueryMock, useRouterMock;

  beforeEach(() => {
    useQueryMock = useQuery.mockReturnValue({
      data: { profilePicture: "test-url", headline: "Test Headline", name: "Test Name" },
      isLoading: false,
      error: null,
    });

    useRouterMock = useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders user profile data correctly", () => {
    render(<SettingsNavbarContainer />);


    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();
    
  });

  test("navigates to home page when home button is clicked", () => {
    render(<SettingsNavbarContainer />);

    fireEvent.click(screen.getByText("غ"));

    expect(useRouterMock().push).toHaveBeenCalledWith("/");
  });

  test("toggles tooltip visibility when profile button is clicked", () => {
    render(<SettingsNavbarContainer />);

    expect(screen.queryByText("View profile")).not.toBeInTheDocument();

    fireEvent.click(screen.getByAltText("profile"));

    expect(screen.getByText("View profile")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();

    fireEvent.click(screen.getByAltText("profile"));

    expect(screen.queryByText("View profile")).not.toBeInTheDocument();
  });



  test("hides tooltip when clicking outside", () => {
    render(<SettingsNavbarContainer />);

    fireEvent.click(screen.getByAltText("profile"));

    expect(screen.getByText("View profile")).toBeInTheDocument();

    fireEvent.mouseDown(document);

    expect(screen.queryByText("View profile")).not.toBeInTheDocument();
  });


});