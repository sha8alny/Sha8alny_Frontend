"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SignUpForm from "../presentation/SignUpForm";
import { handleSignup } from "../../../../services/userMangment";

/**
 * SignUpContainer component handles the user registration process.
 * It uses a mutation to call the signup service and handles the success and error responses.
 * On successful registration, it redirects the user to the signin page.
 * 
 * @component
 * @example
 * return (
 *   <SignUpContainer />
 * )
 */
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

    /**
     * Handles the form submission.
     * Checks if the reCAPTCHA is verified before proceeding with the signup mutation.
     * 
     * @param {Object} formData - The data submitted from the signup form.
     * @param {boolean} formData.recaptcha - The reCAPTCHA verification status.
     */
    const handleSubmit = (formData) => {
        if(!formData.recaptcha){
            alert("Please verify that you are not a robot");
            return;
        }
        mutation.mutate({signUpData: formData});
    };
    return(
        <div className="flex flex-col h-screen bg-background overflow-x-hidden overflow-y-scroll">
                <SignUpForm handleSubmit={handleSubmit} isSubmitting={mutation.isPending}/>
           </div>
    );
};

export default SignUpContainer;