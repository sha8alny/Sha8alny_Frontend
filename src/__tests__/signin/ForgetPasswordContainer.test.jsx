import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgetPasswordContainer from "@/app/components/modules/signin/container/ForgetPasswordContainer";
import { useToast } from "../../app/context/ToastContext";
import { useRouter } from "next/navigation";
import { handleForgetPassword } from "@/app/services/userManagement";

import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../app/context/ToastContext", () => ({
    useToast: jest.fn(),
}));

jest.mock("../../app/services/userManagement", () => ({
    handleForgetPassword: jest.fn(),
}));

describe("ForgetPasswordContainer", () => {
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

    test("renders ForgetPassword component", () => {
        render(<ForgetPasswordContainer />);
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
        expect(screen.getByText("Send Reset Code")).toBeInTheDocument();
    });

    test("validates email input", () => {
        render(<ForgetPasswordContainer />);
        const emailInput = screen.getByPlaceholderText("Enter your email");

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        expect(screen.queryByText("Please enter a valid email address")).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    });

    test("displays error when email is invalid on submit", async () => {
        render(<ForgetPasswordContainer />);
        const emailInput = screen.getByPlaceholderText("Enter your email");
        const submitButton = screen.getByText("Send Reset Code");

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.click(submitButton);

        expect(screen.queryByText("Please enter a valid email address")).toBeInTheDocument();
    });

    test("calls handleForgetPassword and navigates on success", async () => {
        handleForgetPassword.mockResolvedValueOnce({ success: true });

        render(<ForgetPasswordContainer />);
        const emailInput = screen.getByPlaceholderText("Enter your email");
        const submitButton = screen.getByText("Send Reset Code");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleForgetPassword).toHaveBeenCalledWith("test@example.com");
            expect(mockToast).toHaveBeenCalledWith("Check your email for the reset link");
            expect(mockRouterPush).toHaveBeenCalledWith("/reset-password");
        });
    });

    test("displays error toast on failure", async () => {
        handleForgetPassword.mockResolvedValueOnce({ success: false });

        render(<ForgetPasswordContainer />);
        const emailInput = screen.getByPlaceholderText("Enter your email");
        const submitButton = screen.getByText("Send Reset Code");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleForgetPassword).toHaveBeenCalledWith("test@example.com");
            expect(mockToast).toHaveBeenCalledWith("Error sending reset link", false);
        });
    });

    test("handles API error gracefully", async () => {
        handleForgetPassword.mockRejectedValueOnce(new Error("API Error"));

        render(<ForgetPasswordContainer />);
        const emailInput = screen.getByPlaceholderText("Enter your email");
        const submitButton = screen.getByText("Send Reset Code");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleForgetPassword).toHaveBeenCalledWith("test@example.com");
            expect(mockToast).toHaveBeenCalledWith("Error sending reset link", false);
        });
    });
});