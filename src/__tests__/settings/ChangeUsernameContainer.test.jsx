import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { useMutation } from "@tanstack/react-query";
import ChangeUsernameContainer from "../../app/components/modules/settings/container/ChangeUsernameContainer";
import { useToast } from "../../app/context/ToastContext";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
  useToast: jest.fn(),
}));

describe("ChangeUsernameContainer", () => {
  let mutationMock, showToastMock, handleUsernameFormMock;

  beforeEach(() => {
    mutationMock = {
      mutate: jest.fn(),
      isLoading: false,
    };
    useMutation.mockReturnValue(mutationMock);
    showToastMock = jest.fn();
    useToast.mockReturnValue(showToastMock);
    handleUsernameFormMock = jest.fn();
  });

  test("renders input field and submit button", () => {
    render(<ChangeUsernameContainer handleUsernameForm={handleUsernameFormMock} />);
    expect(screen.getByLabelText(/New user name/i)).toBeInTheDocument();
    expect(screen.getByText(/Save user name/i)).toBeInTheDocument();
  });

  test("shows error if username is empty and button is disabled", () => {
    render(<ChangeUsernameContainer handleUsernameForm={handleUsernameFormMock} />);
    fireEvent.change(screen.getByLabelText(/New user name/i), { target: { value: "" } });
    expect(screen.getByText(/Save user name/i)).toBeDisabled();
  });

  test("shows error if username contains numbers", () => {
    render(<ChangeUsernameContainer handleUsernameForm={handleUsernameFormMock} />);
    fireEvent.change(screen.getByLabelText(/New user name/i), { target: { value: "user123" } });
    expect(screen.getByText(/Username cannot contain numeric values./i)).toBeInTheDocument();
  });

  test("calls mutation on valid submit", () => {
    render(<ChangeUsernameContainer handleUsernameForm={handleUsernameFormMock} />);
    fireEvent.change(screen.getByLabelText(/New user name/i), { target: { value: "validUser" } });
    fireEvent.click(screen.getByText(/Save user name/i));
    expect(mutationMock.mutate).toHaveBeenCalledWith({ newUsername: "validUser" });
  });


});
