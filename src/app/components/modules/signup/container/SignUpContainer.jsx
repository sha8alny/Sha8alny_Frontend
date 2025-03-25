"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignUpForm from "../presentation/SignUpForm";
import { handleSignup } from "../../../../services/userManagement";
import { RememberMe } from "@mui/icons-material";

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
        onSuccess: () => {
            alert("Registration Successful & Auto-Login Successful!");
            router.push("/Home");
        },
        onError: (error) => {
            alert(error.message);
        }
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
        if(!formData.recaptcha){
            alert("Please verify that you are not a robot");
            return;
        }
        if(validateForm()){
            const {username, email, password, isAdmin, recapcha, rememberMe}=formData;
            signupMutation.mutate({username,email,password, isAdmin, recapcha, rememberMe });
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
    return(
        <div className="flex flex-col h-screen bg-background overflow-x-hidden overflow-y-scroll">
                <SignUpForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
                handleSubmit={handleSubmit} 
                isSubmitting={signupMutation.isPending}
                onRecaptchaChange={(value) => setFormData((prev)=>({ ...prev, recaptcha: value }))}
                />
           </div>
    );
};


export default SignUpContainer;