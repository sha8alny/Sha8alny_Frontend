import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChangeEmailContainer from "../../app/components/modules/settings/container/ChangeEmailContainer";
import { useToast } from "../../app/context/ToastContext";
import {
  checkEmail,
  sendVerificationEmail,
  verifyEmail,
  updateEmail,
} from "../../app/services/userManagement";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

jest.mock("../../app/services/userManagement", () => ({
  checkEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
  verifyEmail: jest.fn(),
  updateEmail: jest.fn(),
}));

describe("ChangeEmailContainer", () => {
  let checkEmailMutationMock,
    sendVerificationEmailMutationMock,
    verifyEmailMutationMock,
    updateEmailMutationMock,
    showToastMock,
    toggleFormMock,
    queryClientMock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock query client
    queryClientMock = {
      invalidateQueries: jest.fn(),
    };
    useQueryClient.mockReturnValue(queryClientMock);

    // Mock mutations
    checkEmailMutationMock = {
      mutate: jest.fn(),
      isPending: false,
    };

    sendVerificationEmailMutationMock = {
      mutate: jest.fn(),
      isPending: false,
    };

    verifyEmailMutationMock = {
      mutate: jest.fn(),
      isPending: false,
    };

    updateEmailMutationMock = {
      mutate: jest.fn(),
      isPending: false,
    };

    // Configure useMutation to return different mutation objects based on function
    useMutation.mockImplementation((options) => {
      if (options.mutationFn.toString().includes("checkEmail")) {
        return checkEmailMutationMock;
      } else if (
        options.mutationFn.toString().includes("sendVerificationEmail")
      ) {
        return sendVerificationEmailMutationMock;
      } else if (options.mutationFn.toString().includes("verifyEmail")) {
        return verifyEmailMutationMock;
      } else if (options.mutationFn.toString().includes("updateEmail")) {
        return updateEmailMutationMock;
      }
      return { mutate: jest.fn(), isPending: false };
    });

    showToastMock = jest.fn();
    useToast.mockReturnValue(showToastMock);

    toggleFormMock = jest.fn();
  });

  test("renders email form initially", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = screen.getByTestId("new-email-input");
    const passwordInput = screen.getByTestId("password-input-email");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("validates email and password are required", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const submitButton = screen.getByRole("button", { name: /Add Email/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    expect(checkEmailMutationMock.mutate).not.toHaveBeenCalled();
  });

  test("submits form with valid inputs and calls checkEmail", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = screen.getByTestId("new-email-input");
    const passwordInput = screen.getByTestId("password-input-email");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(checkEmailMutationMock.mutate).toHaveBeenCalled();
  });

  test("shows loading state during email validation", () => {
    checkEmailMutationMock.isPending = true;

    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const submitButton = screen.getByRole("button", { name: /Validating/i });
    expect(submitButton).toBeDisabled();
  });

  test("handles error in email validation", () => {
    checkEmailMutationMock.mutate.mockImplementation(() => {
      const mockOptions = useMutation.mock.calls.find((call) =>
        call[0].mutationFn.toString().includes("checkEmail")
      )[0];
      mockOptions.onError({ message: "Invalid credentials" });
    });

    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = screen.getByTestId("new-email-input");
    const passwordInput = screen.getByTestId("password-input-email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Email/i }));

    expect(showToastMock).toHaveBeenCalledWith("Invalid credentials", false);
  });
});
