"use client";
import { useState, useEffect, use } from "react";
import { useToast } from "@/app/context/ToastContext";
import CompleteProfile from "../presentation/CompleteProfile";
import { useMutation } from "@tanstack/react-query";
import { completeProfile } from "../../../../services/userManagement";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";

/** 
 * CompleteProfileContainer component
 *  
 * This component handles the state and logic for completing the user profile.
 * It includes form validation, state management, and submission handling.
 * 
 * @component
 * @example
 * return (
 *   <CompleteProfileContainer />
 * )
 */ 

const CompleteProfileContainer = () => {
    const Auth = useAuth();
    const toast = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
    });
    const [profilePicture, setProfilePicture] = useState("https://www.gravatar.com/avatar/?d=mp&s=200");
    const [saveProfilePic, setSaveProfilePic] = useState(null);
    const [coverPicture, setCoverPicture] = useState("https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png");
    const [saveCoverPic, setSaveCoverPic] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(
            formData.name.trim() !== "" &&
            formData.location.trim() !== "" 
        );
    }, [formData]);

    const handleCompleteProfile = useMutation({
        mutationFn: completeProfile,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }   

    const handleImageChange = (e,type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if(type === "profile"){
                    setProfilePicture(reader.result);
                    setSaveProfilePic(file);}
                if (type === "cover"){
                    setCoverPicture(reader.result);
                    setSaveCoverPic(file);
                }    
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setIsSubmitting(true);
        const profileFile = saveProfilePic ;
        const coverFile = saveCoverPic ;

        
        try {
            const response=await handleCompleteProfile.mutateAsync({
                formData:formData,
                profilePic:profileFile,
                coverPic:coverFile
            });
            if (!response) {
                toast("Error completing profile", false);
                return;
            }
            console.log("✅ Profile updated successfully.");
            toast("Profile updated successfully");
            setTimeout(() => {
                const redirectPath = Auth.getRedirectPath();
                Auth.clearRedirectPath();
                router.push(redirectPath);
                }, 3000);
        } catch (error) {
            console.error("Error completing profile:", error);
            toast("Error completing profile", false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CompleteProfile
            formData={formData}
            profilePic={profilePicture}
            coverPic={coverPicture}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
        />
    );
}

export default CompleteProfileContainer;

