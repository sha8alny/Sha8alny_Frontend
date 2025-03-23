import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../../app/context/ToastContext";
import { useRouter } from "next/navigation";
import DeleteAccountContainer from "@/app/components/modules/settings/container/DeleteAccountContainer";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("DeleteAccountContainer", () => {
  let useQueryMock, showToastMock, routerMock, mutationMock;

  beforeEach(() => {
    useQueryMock = useQuery.mockReturnValue({
      data: { name: "John Doe" },
      isLoading: false,
      error: null,
    });

    mutationMock = {
      mutate: jest.fn(),
      isPending: false,
      onSuccess: jest.fn(),
    };
    
    useMutation.mockReturnValue(mutationMock);
    showToastMock = jest.fn();
    useToast.mockReturnValue(showToastMock);

    routerMock = { push: jest.fn() };
    useRouter.mockReturnValue(routerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders user name and initial form", () => {
    render(<DeleteAccountContainer handleDeleteAccountForm={jest.fn()} />);

    expect(screen.getByText(/we’re sorry to see you go/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to close your account?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });

  test("navigates to password confirmation page on Continue button click", () => {
    render(<DeleteAccountContainer handleDeleteAccountForm={jest.fn()} />);

    const continueButton = screen.getByText(/Continue/i);
    fireEvent.click(continueButton);

    expect(
      screen.getByText(/Enter your password to close this account/i)
    ).toBeInTheDocument();
  });

  test("calls deleteAccountMutation with password on Delete Account button click", async () => {
    render(<DeleteAccountContainer handleDeleteAccountForm={jest.fn()} />);

    const continueButton = screen.getByText(/Continue/i);
    fireEvent.click(continueButton);

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: "testPassword123" } });

    const deleteButton = screen.getByRole("button", {
      name: /Delete account/i,
    });
    fireEvent.click(deleteButton);

    expect(mutationMock.mutate).toHaveBeenCalledWith("testPassword123");
  });

  test("redirects to sign-in page on successful account deletion", async () => {
    mutationMock.onSuccess = jest.fn(() => {
      showToastMock("Email updated successfully");
      routerMock.push("/signin");
    });

    render(<DeleteAccountContainer handleDeleteAccountForm={jest.fn()} />);

    const continueButton = screen.getByText(/Continue/i);
    fireEvent.click(continueButton);

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: "testPassword123" } });

    const deleteButton = screen.getByRole("button", {
      name: /Delete account/i,
    });
    fireEvent.click(deleteButton);

    await mutationMock.onSuccess();

    expect(routerMock.push).toHaveBeenCalledWith("/signin");
  });
});
