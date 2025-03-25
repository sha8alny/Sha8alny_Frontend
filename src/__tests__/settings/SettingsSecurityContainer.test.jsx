import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsSecurityContainer from "../../app/components/modules/settings/container/SettingsSecurityContainer";
import { useQuery } from "@tanstack/react-query";
import { getEmail } from "../../app/services/userMangment";
import { useRouter } from "next/navigation";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../app/services/userMangment", () => ({
  getEmail: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));
describe("SettingsSecurityContainer Integration", () => {
  let useQueryMock;

  beforeEach(() => {
    useQueryMock = useQuery.mockReturnValue({
      data: { email: "user@example.com" },
      isLoading: false,
      error: null,
    });
  
    getEmail.mockResolvedValue({ email: "user@example.com" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders account access settings by default", () => {
    render(<SettingsSecurityContainer />);
    
    expect(screen.getByText("Account access")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("Update email")).toBeInTheDocument();
    expect(screen.getByText("Change password")).toBeInTheDocument();
  });

  test("shows loading state when fetching email", () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<SettingsSecurityContainer />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("switches to change email form when clicked", () => {
    render(<SettingsSecurityContainer />);
    
    fireEvent.click(screen.getByText("Update email"));
    expect(screen.getByText("Change email")).toBeInTheDocument();
    expect(screen.getByText("Emails you've added")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("Update email address")).toBeInTheDocument();
  });



  test("returns to account access from change email form", () => {
    render(<SettingsSecurityContainer />);
    
    fireEvent.click(screen.getByText("Update email"));
    fireEvent.click(screen.getByText("Back"));
    
    expect(screen.getByText("Account access")).toBeInTheDocument();
  });


});