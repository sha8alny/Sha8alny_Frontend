"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import ResetPassword from "../presentation/ResetPassword";
import { handleResetPassword } from "@/app/services/userManagement";
import { useRouter } from "next/navigation";

/**
 * Container component for handling the reset password functionality.
 * Manages state, form validation, and API calls, and passes data to the `ResetPassword` presentation component.
 *
 * @namespace signin
 * @module signin
 * @component
 *
 * @returns {JSX.Element} The ResetPasswordContainer component.
 */

const ResetPasswordContainer = () => {
      /**
   * State for the new password input value.
   * @type {string}
   */
    const [newPassword, setNewPassword] = useState("");
      /**
   * State for the reset code input value.
   * @type {string}
   */
    const [resetCode, setResetCode] = useState("");
    const [loading, setLoading] = useState(false);
      /**
   * State for storing error messages related to the password input.
   * @type {string|null}
   */
    const [passwordError, setPasswordError] = useState(null);
    const [resetCodeError, setResetCodeError] = useState(null);
      /**
   * State for controlling the validity of the new password.
   * @type {boolean}
   */
    const [isPasswordValid, setIsPasswordValid] = useState(false);
      /**
   * State for controlling the validity of the reset code.
   * @type {boolean}
   */
    const [isResetCodeValid, setIsResetCodeValid] = useState(false);
      /**
   * State for controlling the validity of the entire form.
   * @type {boolean}
   */
    const [isFormValid, setIsFormValid] = useState(false);
      /**
   * Toast function for displaying notifications.
   * @type {Function}
   */
    const toast = useToast();
      /**
   * Next.js router for navigation.
   * @type {Object}
   */
    const router = useRouter();
      /**
   * State for the confirm password input value.
   * @type {string}
   */
    const [confirmPassword, setConfirmPassword] = useState("");
      /**
   * State for storing error messages related to the confirm password input.
   * @type {string|null}
   */
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
      /**
   * State for controlling the validity of the confirm password.
   * @type {boolean}
   */
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
      /**
   * State for controlling the visibility of the reset password form.
   * @type {boolean}
   */
    const [showForm, setShowForm] = useState(false);
  /**
   * Effect to validate the entire form whenever any of the input states change.
   */

    useEffect(() => {
        setIsFormValid(
            newPassword.trim() !== "" &&
            resetCode.trim() !== "" &&
            isPasswordValid &&
            isResetCodeValid &&
            isConfirmPasswordValid
        );
    }, [newPassword, resetCode, isPasswordValid, isResetCodeValid, isConfirmPasswordValid]);
    const validatePassword = (value) => {
        const valid = value.length >= 8;
        setIsPasswordValid(valid);
        if (!valid) {
            setPasswordError("Password must be 8 characters or more.");
          } else {
            setPasswordError(null);
          }
    };
    const validateResetCode = (value) => {
        const valid = value.length === 6;
        setIsResetCodeValid(valid);
        if (!valid) {
            setResetCodeError("Reset code must be 6 digits.");
            } else {
            setResetCodeError(null);
            }
    };
    const validateConfirmPassword = (value) => {
        const valid = value === newPassword;
        setIsConfirmPasswordValid(valid);
        if (!valid) {
            setConfirmPasswordError("Passwords do not match.");
        }
        else {
            setConfirmPasswordError(null);
        }
    };

    const handleChange = (name,value) => {
        if(name === "resetCode") {
            const numericValue = value.replace(/\D/g, "");
            setResetCode(numericValue);
            validateResetCode(numericValue);
        }
        else if (name === "newPassword") {
            setNewPassword(value);
            validatePassword(value);
        }
        else if (name === "confirmPassword") {
            setConfirmPassword(value);
            validateConfirmPassword(value);
        }
        
    };

    const handleSubmit =async (e) => {
        e.preventDefault ();
        if (!isFormValid) {
            return;
        }
        setLoading(true);
        try {
            const response = await handleResetPassword(resetCode,newPassword);
            if (response.success) {
                toast("Password reset successfully");
                setTimeout(() => {
                    router.push("/signin");
                }, 3000);
            } else {
                toast(response.message, false);}
        }
        catch (error) {
            console.error("Error resetting password:", error);
            toast("Error resetting password", false);
        }
        finally {
            setLoading(false);
        }
        
}
    return (
        <ResetPassword
            newPassword={newPassword}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            passwordError={passwordError}
            resetCodeError={resetCodeError}
            resetCode={resetCode}
            isFormValid={isFormValid}
            confirmPassword={confirmPassword}
            confirmPasswordError={confirmPasswordError}
            showForm={showForm}
        />
    );
}
export default ResetPasswordContainer;