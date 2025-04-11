import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordContainer from "../../app/components/modules/signin/container/ResetPasswordContainer";
import { useToast } from "../../app/context/ToastContext";
import { useRouter } from "next/navigation";
import { handleResetPassword } from "@/app/services/userManagement";
import "@testing-library/jest-dom";


// Mock ResizeObserver
global.ResizeObserver = class {
    constructor(callback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
};
// Mock dependencies
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
    useToast: jest.fn(),
}));

jest.mock("../../app/services/userManagement", () => ({
    handleResetPassword: jest.fn(),
}));

describe("ResetPasswordContainer", () => {
    let mockRouterPush;
    let mockToast;

    beforeEach(() => {
        mockRouterPush = jest.fn();
        mockToast = jest.fn();
        useRouter.mockReturnValue({ push: mockRouterPush });
        useToast.mockReturnValue(mockToast);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders ResetPassword component", () => {
        render(<ResetPasswordContainer />);
        expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
    });

    test("validates reset code input", () => {
        render(<ResetPasswordContainer />);
        const resetCodeInput = screen.getByRole("textbox");

        fireEvent.change(resetCodeInput, { target: { value: "123" } });
        expect(screen.getByText("Reset code must be 6 digits.")).toBeInTheDocument();

        fireEvent.change(resetCodeInput, { target: { value: "123456" } });
        expect(screen.queryByText("Reset code must be 6 digits.")).not.toBeInTheDocument();
    });

    test("validates password input", () => {
        render(<ResetPasswordContainer />);
        const passwordInput = screen.getByPlaceholderText("New Password");

        fireEvent.change(passwordInput, { target: { value: "123" } });
        expect(screen.getByText("Password must be 6 characters or more.")).toBeInTheDocument();

        fireEvent.change(passwordInput, { target: { value: "123456" } });
        expect(screen.queryByText("Password must be 6 characters or more.")).not.toBeInTheDocument();
    });

    test("disables submit button when form is invalid", () => {
        render(<ResetPasswordContainer />);
        const submitButton = screen.getByRole("button", { name: /Reset Password/i });


        expect(submitButton).toBeDisabled();
    });

    test("calls handleResetPassword and navigates on success", async () => {
        handleResetPassword.mockResolvedValueOnce({ success: true });
        jest.useFakeTimers();
        render(<ResetPasswordContainer />);
        const resetCodeInput = screen.getByRole("textbox");
        const passwordInput = screen.getByPlaceholderText("New Password");
        const submitButton = screen.getByRole("button", { name: /Reset Password/i });

        fireEvent.change(resetCodeInput, { target: { value: "123456" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleResetPassword).toHaveBeenCalledWith("123456", "password123");
            expect(mockToast).toHaveBeenCalledWith("Password reset successfully");
        });
        jest.advanceTimersByTime(3000);
        expect(mockRouterPush).toHaveBeenCalledWith("/");
        jest.useRealTimers();
    });

    test("displays error toast on failure", async () => {
        handleResetPassword.mockResolvedValueOnce({ success: false, message: "Invalid reset code" });

        render(<ResetPasswordContainer />);
        const resetCodeInput = screen.getByRole("textbox");
        const passwordInput = screen.getByPlaceholderText("New Password");
        const submitButton = screen.getByRole("button", { name: /Reset Password/i });

        fireEvent.change(resetCodeInput, { target: { value: "123456" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleResetPassword).toHaveBeenCalledWith("123456", "password123");
            expect(mockToast).toHaveBeenCalledWith("Invalid reset code", false);
        });
    });

    test("handles API error gracefully", async () => {
        handleResetPassword.mockRejectedValueOnce(new Error("API Error"));

        render(<ResetPasswordContainer />);
        const resetCodeInput = screen.getByRole("textbox");
        const passwordInput = screen.getByPlaceholderText("New Password");
        const submitButton = screen.getByRole("button", { name: /Reset Password/i });

        fireEvent.change(resetCodeInput, { target: { value: "123456" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleResetPassword).toHaveBeenCalledWith("123456", "password123");
            expect(mockToast).toHaveBeenCalledWith("Error resetting password", false);
        });
    });
});