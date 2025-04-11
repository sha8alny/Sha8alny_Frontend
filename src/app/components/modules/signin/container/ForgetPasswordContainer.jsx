"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import ForgetPassword from "../presentation/ForgetPassword";
import { handleForgetPassword } from "@/app/services/userManagement";
import { useRouter } from "next/navigation";



const ForgetPasswordContainer = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const [isValid, setIsValid] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(emailRegex.test(email));
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
        setError(null);
        if (!isValid) {
            setError("Please enter a valid email address");
        }
        
    };

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