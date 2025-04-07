"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignInForm from "../presentation/SignInForm";
import { handleSignIn } from "../../../../services/userManagement";
import { useToast } from "@/app/context/ToastContext";
import { set } from "date-fns";

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
  const toast = useToast();

  const loginMutation = useMutation({
    mutationFn: handleSignIn,
  });

  /**
   * Handles the form submission.
   * @param {string} email - The email entered by the user.
   * @param {string} password - The password entered by the user.
   * @param {boolean} rememberMe - The "Remember Me" checkbox status.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: (data) => {
          if (data.success) {
          toast("Welcome back!");
          setTimeout(() => {
            router.push("/");
          }, 3000);}
          else{
            toast("Incorrect email or password",false);}
        },
        onError: (error) => alert(error.message),
      }
    );
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
        handleSubmit={handleSubmit}
        isSubmitting={loginMutation.isPending}
      />
    </div>
  );
};

export default SignInContainer;
