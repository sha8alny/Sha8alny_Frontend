"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import ResetPassword from "../presentation/ResetPassword";
import { handleResetPassword } from "@/app/services/userManagement";
import { useRouter } from "next/navigation";



const ResetPasswordContainer = () => {
    const [newPassword, setNewPassword] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [resetCodeError, setResetCodeError] = useState(null);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isResetCodeValid, setIsResetCodeValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const [showForm, setShowForm] = useState(false);


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