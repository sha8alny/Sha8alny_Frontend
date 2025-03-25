import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useMutation } from "@tanstack/react-query";
import ChangeEmailContainer from "../../app/components/modules/settings/container/ChangeEmailContainer";
import { useToast } from "../../app/context/ToastContext";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

describe("ChangeEmailContainer", () => {
  let mutationMock, showToastMock, toggleFormMock;

  beforeEach(() => {
    mutationMock = {
      mutate: jest.fn(),
      isPending: false,
    };
    useMutation.mockReturnValue(mutationMock);

    showToastMock = jest.fn();
    useToast.mockReturnValue(showToastMock);

    toggleFormMock = jest.fn();
  });

  test("renders email input, password input, and submit button", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("validation for missing inputs", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    fireEvent.click(submitButton);

    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test("shows error if email format is invalid", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = document.querySelector("input[type='email']");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test("submits form if inputs are valid", () => {
    render(<ChangeEmailContainer toggleForm={toggleFormMock} />);

    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const submitButton = screen.getByRole("button", { name: /Add Email/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mutationMock.mutate).toHaveBeenCalled();
  });



});
