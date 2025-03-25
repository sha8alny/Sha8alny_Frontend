import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../app/context/ToastContext";
import ChangePasswordContainer from "../../app/components/modules/settings/container/ChangePasswordContainer";
import { useRouter } from "next/navigation";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));
  
describe("ChangePasswordContainer", () => {
  let mutationMock, showToastMock, toggleFormMock;

  beforeEach(() => {
    mutationMock = {
      mutate: jest.fn(),
      isLoading: false,
    };
    useMutation.mockReturnValue(mutationMock);

    showToastMock = jest.fn();
    useToast.mockReturnValue(showToastMock);

    toggleFormMock = jest.fn();
    pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      push: pushMock,
    }));
  });

  test("renders input fields and submit button", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);

    expect(screen.getByLabelText(/Type your current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type your new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Retype the password/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Password/i)).toBeInTheDocument();
  });

  test("disables submit button when any required field is empty", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);
  
    const submitButton = screen.getByText(/Save Password/i);
    expect(submitButton).toBeDisabled();
  
    fireEvent.change(screen.getByLabelText(/Type your current password/i), { target: { value: "currentPass123" } });
    fireEvent.change(screen.getByLabelText(/Type your new password/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/Retype the password/i), { target: { value: "newPassword123" } });
  
    expect(submitButton).not.toBeDisabled();
  });

  test("shows error when passwords do not match", async () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);

    fireEvent.change(screen.getByLabelText(/Type your new password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Retype the password/i), { target: { value: "password321" } });

    fireEvent.click(screen.getByText(/Save Password/i));
    expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();

  });

  test("shows error when new password is too short", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);
  
    fireEvent.change(screen.getByLabelText(/Type your new password/i), { target: { value: "short" } });
    fireEvent.blur(screen.getByLabelText(/Type your new password/i));
  
    expect(screen.getByText(/Your password is too short/i)).toBeInTheDocument();
  });
  
  test("shows error when new password is too long", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);
  
    const longPassword = "a".repeat(201);
    fireEvent.change(screen.getByLabelText(/Type your new password/i), { target: { value: longPassword } });
    fireEvent.blur(screen.getByLabelText(/Type your new password/i));
  
    expect(screen.getByText(/Your password is too long/i)).toBeInTheDocument();
  });
 
  test("toggles tooltip visibility on button click", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);
  
    const tooltipButton = screen.getByText(/What makes a strong password?/i);
    fireEvent.click(tooltipButton);
  
    expect(screen.getByText(/Choose a strong password/i)).toBeInTheDocument();
  
    fireEvent.click(tooltipButton);
    expect(screen.queryByText(/Choose a strong password/i)).not.toBeInTheDocument();
  });
  
  test("hides tooltip when clicking outside", () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);
  
    const tooltipButton = screen.getByText(/What makes a strong password?/i);
    fireEvent.click(tooltipButton);
  
    expect(screen.getByText(/Choose a strong password/i)).toBeInTheDocument();
  
    fireEvent.mouseDown(document);
    expect(screen.queryByText(/Choose a strong password/i)).not.toBeInTheDocument();
  });
 
 test("calls mutation on valid submit", async () => {
    render(<ChangePasswordContainer toggleForm={toggleFormMock} />);

    fireEvent.change(screen.getByLabelText(/Type your current password/i), { target: { value: "currentPass123" } });
    fireEvent.change(screen.getByLabelText(/Type your new password/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/Retype the password/i), { target: { value: "newPassword123" } });

    fireEvent.click(screen.getByText(/Save Password/i));

  
      expect(mutationMock.mutate).toHaveBeenCalledWith({
        currentPassword: "currentPass123",
        newPassword: "newPassword123",
      });

  });

 


});

