"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignUpForm from "../presentation/SignUpForm";
import { handleSignup, handleSignupCross } from "../../../../services/userManagement";
import { RememberMe } from "@mui/icons-material";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace signup
 * @module signup
 */
/**
 * SignUpContainer component handles the user registration process.
 * It uses a mutation to call the signup service and handles the success and error responses.
 * On successful registration, it redirects the user to the Home page.
 * 
 * @component
 * @example
 * return (
 *   <SignUpContainer />
 * )
 */
const SignUpContainer = () => {
    const toast = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
        recaptcha: "",
        rememberMe: false,
    });
    const [error, setError] = useState({
        email: "",
        password: "",
    }
    );
    
    const signupMutation = useMutation({
        mutationFn: handleSignup,
    });

    const validateField = (name,value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setError((prev)=>{
        const newErrors = {...prev};
        if (name==="email") {
            newErrors.email = emailRegex.test(value) ? "" : "Please enter a valid email address.";
        }
        if (name==="password") {
            newErrors.password = value.length >= 6 ? "" : "Password must be 6 characters or more.";
        }
        if (name==="username") {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            newErrors.username = value.length >= 3 && usernameRegex.test(value) 
            ? "" 
            : "Username must be at least 3 characters and contain only letters, numbers, and underscores.";
        }
      return newErrors;
    });
    };

    const validateForm = () => {
        validateField("email",formData.email);
        validateField("password",formData.password);
        return !error.email && !error.password;
    };
    /**
     * Handles the form submission.
     * Checks if the reCAPTCHA is verified before proceeding with the signup mutation.
     * 
     * @param {Object} formData - The data submitted from the signup form.
     * @param {boolean} formData.recaptcha - The reCAPTCHA verification status.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        

        if(!formData.recaptcha || typeof formData.recaptcha !== "string"){
            alert("Please verify that you are not a robot");
            console.log("🚫 Recaptcha not verified");
            return;
        }
        if(validateForm()){
            const {username, email, password, isAdmin, recaptcha, rememberMe}=formData;
            console.log("🚀 Calling Mutation with:", { username, email, password, isAdmin, recaptcha, rememberMe });

            signupMutation.mutate({username,email,password, isAdmin, recaptcha, rememberMe }, 
                {onSuccess: () =>
                  {toast("Registration Successful & Auto-Login Successful!");
                    router.push('/complete-profile');},
                 onError: (error) => {
                        toast("Email or Username already taken!", false);
                },});
        }

    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        validateField(name,value);
    };
    const handleRecaptchaChange = (token) => {
        setFormData((prev) => ({ ...prev, recaptcha: token }));
    }

    return(
        <div className="flex flex-col h-screen bg-background overflow-x-hidden overflow-y-scroll">
                <SignUpForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
                handleSubmit={handleSubmit} 
                isSubmitting={signupMutation.isPending}
                onRecaptchaChange={handleRecaptchaChange}                />
           </div>
    );
};


export default SignUpContainer;