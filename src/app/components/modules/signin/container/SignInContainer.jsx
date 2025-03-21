"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import SignInForm from "../presentation/SignInForm";
import { handleSignIn } from "../../../../services/userMangment";

/**
 * SignInContainer component handles the user login process.
 * It uses a mutation to call the signin service and handles the success and error responses.
 * On successful login, it redirects the user to the Home page.
 * 
 * @component
 * @example
 * return (
 *   <SignInContainer />
 * )
 */
const SignInContainer = () => {
    const router = useRouter();
    const [recaptcha, setRecaptcha] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

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
     * 
     * @param {boolean} recaptcha - The reCAPTCHA verification status.
     * @param {string} email - The email entered by the user.
     * @param {string} password - The password entered by the user.
     * @param {boolean} rememberMe - The "Remember Me" checkbox status.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!recaptcha) {
            alert("Please verify that you are not a robot");
            return;
        }

        loginMutation.mutate({ email, password, rememberMe });
    };
   
    return (
        <div className="flex items-center justify-center min-h-screen bg-background ">
            <SignInForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            setRecaptcha={setRecaptcha}
            handleSubmit={handleSubmit} 
            isSubmitting={loginMutation.isPending} />
        </div>
    );
};

export default SignInContainer;