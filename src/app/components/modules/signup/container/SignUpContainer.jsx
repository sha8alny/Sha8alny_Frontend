"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SignUpForm from "../presentation/SignUpForm";
import { handleSignup } from "../../../../services/userMangment";


const SignUpContainer = () => {
    const router = useRouter();
    
    const mutation = useMutation({
        mutationFn: handleSignup,
        onSuccess: () => {
            alert("Registration Successful!");
            router.push("/signin");
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const handleSubmit = (formData) => {
        if(!formData.recaptcha){
            alert("Please verify that you are not a robot");
            return;
        }
        mutation.mutate({signUpData: formData});
    };
    return(
        <div className="flex flex-col h-screen bg-background overflow-x-hidden overflow-y-scroll">
            <div className="flex flex-col md:flex-row h-full">
                <SignUpForm handleSubmit={handleSubmit} isSubmitting={mutation.isPending}/>
            </div> 
           </div>
    );
};

export default SignUpContainer;