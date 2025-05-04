"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import ForgetPassword from "../presentation/ForgetPassword";
import { handleForgetPassword } from "@/app/services/userManagement";
import { useRouter } from "next/navigation";

/**
 * Container component for handling the forget password functionality.
 * Manages state, form validation, and API calls, and passes data to the `ForgetPassword` presentation component.
 *
 * @namespace signin
 * @module signin
 * @component
 *
 * @returns {JSX.Element} The ForgetPasswordContainer component.
 */

const ForgetPasswordContainer = () => {
      /**
   * State for the email input value.
   * @type {string}
   */
    const [email, setEmail] = useState("");
     /**
   * State for controlling the loading state of the forget password action.
   * @type {boolean}
   */
    const [loading, setLoading] = useState(false);
      /**
   * State for storing error messages related to the email input.
   * @type {string|null}
   */
    const [error, setError] = useState(null);
      /**
   * Toast function for displaying notifications.
   * @type {Function}
   */
    const toast = useToast();
    
  /**
   * State for validating the email input.
   * @type {boolean}
   */
    const [isValid, setIsValid] = useState(false);
     /**
   * Next.js router for navigation.
   * @type {Object}
   */
    const router = useRouter();
      /**
   * Handles changes to the email input field.
   * Validates the email format and updates the state.
   *
   * @param {Object} e - The event object from the input field.
   */

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(value);
        setIsValid(valid);
    
        if (!valid) {
            setError("Please enter a valid email address");
        } else {
            setError(null);
        }
    };
    
  /**
   * Handles the forget password form submission.
   * Sends the email to the server and displays a success or error message.
   *
   * @param {Object} e - The event object from the form submission.
   */
    const handleSubmit =async (e) => {
        e.preventDefault ();
        setLoading(true);
        try {
            const response = await handleForgetPassword(email);
            if (response.success) {
                toast("Check your email for the reset link");
                router.push("/reset-password");
            } else {
                toast("Error sending reset link", false);
            }
        }
        catch (error) {
            console.error("Error sending reset link:", error);
            toast("Error sending reset link", false);
        }
        finally {
            setLoading(false);
        }
        
}
    return (
        <ForgetPassword
            email={email}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            isValid={isValid}
        />
    );
}
export default ForgetPasswordContainer;