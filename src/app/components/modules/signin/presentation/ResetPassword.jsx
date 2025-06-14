"use client";

import { Target } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../../../ui/Input-otp"
/**
 * ResetPassword component displays a form for users to reset their password.
 * Handles user input for the reset code, new password, and confirm password fields.
 * Provides a submit button to trigger the password reset process.
 *
 * @namespace signin
 * @module signin
 * @component
 *
 * @param {Object} props - The component props.
 * @param {string} props.resetCode - The current value of the reset code input field.
 * @param {Function} props.setResetCode - Function to update the reset code input field.
 * @param {string} props.newPassword - The current value of the new password input field.
 * @param {Function} props.setNewPassword - Function to update the new password input field.
 * @param {string} props.confirmPassword - The current value of the confirm password input field.
 * @param {Function} props.setConfirmPassword - Function to update the confirm password input field.
 * @param {boolean} props.isFormValid - Indicates whether the form is valid for submission.
 * @param {Function} props.validatePassword - Function to validate the new password input.
 * @param {Function} props.validateResetCode - Function to validate the reset code input.
 * @param {string|null} props.passwordError - Error message related to the new password input, if any.
 * @param {string|null} props.confirmPasswordError - Error message related to the confirm password input, if any.
 * @param {boolean} props.showForm - Indicates whether the reset password form should be displayed.
 * @param {Function} props.setShowForm - Function to toggle the visibility of the reset password form.
 *
 * @returns {JSX.Element} The ResetPassword component.
 */

const ResetPassword =({
    newPassword,
    resetCode,
    handleChange,
    handleSubmit,
    loading,
    passwordError,
    resetCodeError,
    isFormValid,
    confirmPassword,
    confirmPasswordError

}) => {
    return(
        <div className="relative flex items-center justify-center min-h-screen bg-background ">
        <div className="absolute top-1/2 left-1/2 transform lg:-translate-x-[55vw] md:-translate-x-[63vw] sm:-translate-x-[60vw] translate-x-[-49vw] xl:translate-y-[-31vw] md:translate-y-[-20vw] sm:translate-y-[-32vw] translate-y-[-120vw] 
            xl:w-250 xl:h-250 md:w-120 md:h-120 w-100 h-100">
        <img
            src="/lightmode.svg"
            alt="App Logo"
            className="w-full h-full object-contain dark:hidden"
        />
        <img
            src="/darkmode.svg"
            alt="App Logo"
            className="w-full h-full object-contain hidden dark:block"
        />
        </div>

        {/* Form wrapper */}
        <div className="w-full max-w-md ml-auto xl:translate-x-[-13vw] md:translate-x-[-5vw] sm:translate-x-[-10vw] translate-x-[5vw] xl:translate-y-[2vw] md:translate-y-[5vw] sm:translate-y-[13vw] translate-y-[12vh] opacity-100 z-10">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Reset Password</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-center w-70 h-5  text-background rounded-full mx-auto">
            <h2 className="text-l font-bold text-center text-text">Enter The Reset Code:</h2>
            </div>
             <div className="flex items-center justify-center w-70 h-15  text-text rounded-full mx-auto">
            <InputOTP 
            maxLength={6}
            value={resetCode}
            onChange={(value) => handleChange("resetCode",value )}
            >
            <InputOTPGroup >
                <InputOTPSlot data-testid="otp-input0" index={0} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot data-testid="otp-input1" index={1} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot data-testid="otp-input2" index={2} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot data-testid="otp-input3" index={3} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot data-testid="otp-input4" index={4} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot data-testid="otp-input5" index={5} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            </InputOTP>
            </div>
            {resetCodeError && (
                <p className="text-red-500 text-sm mt-2">
                    {resetCodeError}
                </p>
            )}
                <input
                    data-testid="new-password-input"
                    type="password"
                    placeholder="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                    required
                />
                {passwordError && (
                    <p className="text-red-500 text-sm mt-2">
                        {passwordError}
                    </p>
                )}
                <input
                    data-testid="confirm-password-input"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                    required
                />
                {confirmPasswordError && (
                    <p className="text-red-500 text-sm mt-2">
                        {confirmPasswordError}
                    </p>
                )}

                <button
                    data-testid="reset-password-button"
                    type="submit"
                    className={`bg-secondary text-background rounded-md px-4 py-2 hover:bg-secondary-light transition duration-300 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                <p className="text-center flex flex-col text-text text-sm mt-4">
                    Reset Code Expired Or Incorrect Email?
                    <a href="/forget-password" className="text-secondary font-semibold hover:underline" data-testid="forgot-password-button">
                      Try Again 
                    </a>
                </p>
                <p className="text-center text-text text-sm mt-4">
                    Remembered your password? 
                    <a href="/signin" className="text-secondary font-semibold hover:underline" data-testid="signin"> Sign In</a>
                </p>
            </form>

            </div>
            </div>
            </div>

    )
}


export default ResetPassword