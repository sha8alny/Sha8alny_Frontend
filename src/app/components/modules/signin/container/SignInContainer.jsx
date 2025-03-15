"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SignInForm from "../presentation/SignInForm";
import { handleSignIn } from "../../../../services/userMangment";


const SignInContainer = () => {
    const router=useRouter();

    const loginMutation= useMutation({
        mutationFn: handleSignIn,
        onSuccess:()=> {
            alert("Login Successful!")
            router.push("/Home")
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const handleSubmit = (formData) => {
        if(!formData.recaptcha){
            alert("Please verify that you are not a robot");
            return;
        }
        const {email, password}=formData

        loginMutation.mutate({ email,password });
    };



return(
    <div className="flex items-center justify-center min-h-screen bg-background ">
      <SignInForm handleSubmit={handleSubmit} isSubmitting={ loginMutation.isPending}/>
    </div>
);
};

export default SignInContainer;