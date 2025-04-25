"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignUpForm from "../presentation/SignUpForm";
import { handleSignup, sendVerificationEmail, verifyEmail, checkSignupData,checkVerifiedEmail, handleGoogleSignIn } from "../../../../services/userManagement";
import { RememberMe } from "@mui/icons-material";
import { useToast } from "@/app/context/ToastContext";
import VerifyEmail from "../presentation/VerifyEmail";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";

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
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");
    const [verifyCodeError, setVerifyCodeError] = useState("");
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
        username: "",
    }
    );
    const [confirmPassword, setConfirmPassword] = useState("");
    
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
            newErrors.password = value.length >= 8 ? "" : "Password must be 8 characters or more.";
        }
        if (name==="username") {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            newErrors.username = value.length >= 3 && usernameRegex.test(value) 
            ? "" 
            : "Username must be at least 3 characters and contain only letters, numbers, and underscores.";
        }
        if (name==="confirmPassword") {
            newErrors.confirmPassword = value === formData.password ? "" : "Passwords do not match.";
        }
      return newErrors;
    });
    };

    const validateForm = () => {
        validateField("email",formData.email);
        validateField("password",formData.password);
        validateField("username",formData.username);
        validateField("confirmPassword",confirmPassword);
        return !error.email && !error.password && !error.username && !error.confirmPassword;
    };

   const performSignupMutation = async () => { 
    const { username, email, password, isAdmin, recaptcha, rememberMe } = formData;
    
    signupMutation.mutate(
        { username, email, password, isAdmin, recaptcha, rememberMe, signUpType: "email",token: "" },
        {
            onSuccess: () => {
                toast("Registration Successful & Auto-Login Successful!");
                router.push('/complete-profile');
            },
            onError: (error) => {
                toast("Error during registration. Please try again.", false);
                console.error("Error during registration:", error);
                router.push('/signup');
            },
        }
    );
    }
    /**
     * Handles the form submission.
     * Checks if the reCAPTCHA is verified before proceeding with the signup mutation.
     * 
     * @param {Object} formData - The data submitted from the signup form.
     * @param {boolean} formData.recaptcha - The reCAPTCHA verification status.
     */
    const handleSubmit = async(e) => {
        e.preventDefault();
        

        if(!formData.recaptcha || typeof formData.recaptcha !== "string"){
            toast("Please verify that you are not a robot", false);
            console.log("🚫 Recaptcha not verified");
            return;
        }
        if(validateForm()){
            try{
                const {username, email, password, }=formData;
                const {success, message}= await checkSignupData({username, email, password});
                console.log("error",message)
                if(!success){
                    toast(message, false);
                    return;
                }
                const emailSent =await sendVerificationEmail (email);
                if(emailSent){
                    setIsEmailSent(true);
                    toast("Verification email sent! Please check your inbox.");
                }
                else{
                    toast("Error sending verification email. Please try again.", false);
                }
            } catch(error){
                console.error("Error sending verification email:", error);
                toast("Error sending verification email. Please try again.", false);
            }
        }

    };
    const handleEmailVerification = async () => {
        try{
            const  isVerified = await verifyEmail(formData.email, verifyCode);
            console.log("isVerified", isVerified);
            if(isVerified){
                setIsEmailVerified(true);
                toast("Email verified successfully!");
                performSignupMutation();
                }else{
                    setVerifyCodeError("Invalid verification code. Please try again.");
                    toast("Email verification failed. Please try again.", false);
                }
            }
            catch(error){
                console.error("Error verifying email:", error);
                setVerifyCodeError("Invalid verification code. Please try again.");
            }
    }
    useEffect(() => {
        let intervalId;
        if (isEmailSent && !isEmailVerified) {
            intervalId = setInterval(async () => {
                console.log("🔁 Checking if email is verified...");
                try {
                    const isVerified = await checkVerifiedEmail(formData.email);
                    if (isVerified) {
                        clearInterval(intervalId);
                        setIsEmailVerified(true);
                        toast("Email verified successfully Via Link!");
                        performSignupMutation();
                    }
                } catch (error) {
                    console.error("Error during periodic verification check:", error);
                }
            }, 30000); 
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isEmailSent, isEmailVerified, formData, performSignupMutation]);
    
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if(name === "confirmPassword") {
            setConfirmPassword(value);
        }
        validateField(name,value);
    };
    const handleRecaptchaChange = (token) => {
        setFormData((prev) => ({ ...prev, recaptcha: token }));
    }

    const handleResendEmail = async () => {
        try {
            const emailSent = await sendVerificationEmail(formData.email);
            if (emailSent) {
                toast("Verification email resent! Please check your inbox.");
            }
            else {
                toast("Error resending verification email. Please try again.", false);
            }
        }
        catch (error) {
            console.error("Error resending verification email:", error);
            toast("Error resending verification email. Please try again.", false);
        }
    }

    const handleGoogleSignUp = async () => {
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken(true);

            const loginResult = await handleGoogleSignIn(token);
            if(loginResult.success){
                toast("Google Sign-Up Successful!");
                router.push('/complete-profile');
            }else{
                toast("Error during Google Sign-In. Please try again.", false);
                console.error("Google Sign-In Error:", loginResult.message);
            }

    }catch(error){
        console.error("Error signing up with Google:", error);
        toast("Error signing up with Google. Please try again.", false);
    }
    };

    return(
        <div className="flex flex-col h-screen bg-background overflow-x-hidden overflow-y-scroll">
              {!isEmailSent? (
                <SignUpForm 
                formData={formData}
                confirmPassword={confirmPassword}
                handleChange={handleChange}
                error={error}
                handleSubmit={handleSubmit} 
                isSubmitting={signupMutation.isPending}
                onRecaptchaChange={handleRecaptchaChange}
                onGoogleSignUp={handleGoogleSignUp}
                />
              ): (
                <VerifyEmail 
                verifyCode={verifyCode}
                setVerifyCode={setVerifyCode}
                handleSubmit={(e)=> {
                    e.preventDefault();
                    handleEmailVerification();
                }}
                loading={signupMutation.isPending}
                verifyCodeError={verifyCodeError}
                isFormValid={verifyCode.length === 6}
                handleResendEmail={handleResendEmail}
                emailToVerify={formData.email}
                />
              )}
           </div>
    );
};


export default SignUpContainer;