"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignInForm from "../presentation/SignInForm";
import { handleSignIn } from "../../../../services/userManagement";
import { useToast } from "@/app/context/ToastContext";
import { set } from "date-fns";
import {useAuth} from "@/app/context/AuthContext";

/**
 * @namespace signin
 * @module signin
 */
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();
  const Auth = useAuth();
  const isCompleteProfile = localStorage.getItem("isProfileComplete");

  const loginMutation = useMutation({
    mutationFn: handleSignIn,
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
  return newErrors;
});
};

const validateForm = () => {
    validateField("email",email);
    validateField("password",password);
    return !error.email && !error.password;
};
  /**
   * Handles the form submission.
   * @param {string} email - The email entered by the user.
   * @param {string} password - The password entered by the user.
   * @param {boolean} rememberMe - The "Remember Me" checkbox status.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast("Please fill in all fields correctly", false);
      return;
    }

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: (data) => {
          if (data.success) {
          toast("Welcome back!");
          console.log("isCompleteProfile",isCompleteProfile);
          setTimeout(() => {
            if (isCompleteProfile === "false") {
              router.push("/complete-profile");
              return;
            }
            const redirectPath = Auth.getRedirectPath();
            Auth.clearRedirectPath();
            router.push(redirectPath);
            }, 3000);}
          else{
            toast("Incorrect email or password",false);}
        },
        onError: (error) => {toast(error.message, false);},
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      validateField(name,value);
    }
    if (name === "password") {
      setPassword(value);
      validateField(name,value);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background ">
      <SignInForm
        email={email}
        password={password}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        handleSubmit={handleSubmit}
        isSubmitting={loginMutation.isPending}
        error={error}
        handleChange={handleChange}
      />
    </div>
  );
};

export default SignInContainer;
