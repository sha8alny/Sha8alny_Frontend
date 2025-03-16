"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SignInForm from "../presentation/SignInForm";
import { handleSignIn } from "../../../../services/userMangment";

/**
 * SignInContainer component handles the user login process.
 * It uses a mutation to call the signin service and handles the success and error responses.
 * On successful login, it redirects the user to the home page.
 * 
 * @component
 * @example
 * return (
 *   <SignInContainer />
 * )
 */
const SignInContainer = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: handleSignIn,
        onSuccess: () => {
            alert("Login Successful!");
            router.push("/Home");
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    /**
     * Handles the form submission.
     * Checks if the reCAPTCHA is verified before proceeding with the signin mutation.
     * 
     * @param {Object} formData - The data submitted from the signin form.
     * @param {boolean} formData.recaptcha - The reCAPTCHA verification status.
     * @param {string} formData.email - The email entered by the user.
     * @param {string} formData.password - The password entered by the user.
     */
    const handleSubmit = (formData) => {
        if (!formData.recaptcha) {
            alert("Please verify that you are not a robot");
            return;
        }
        const { email, password } = formData;

        loginMutation.mutate({ email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background ">
            <SignInForm handleSubmit={handleSubmit} isSubmitting={loginMutation.isPending} />
        </div>
    );
};

export default SignInContainer;