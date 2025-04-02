"use client";
import { useState, useEffect, use } from "react";
import { useToast } from "@/app/context/ToastContext";
import CompleteProfile from "../presentation/CompleteProfile";
import { useMutation } from "@tanstack/react-query";
import { completeProfile } from "../../../../services/userManagement";
import { useRouter } from "next/navigation";

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
    const toast = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullname: "",
        location: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(
            formData.fullname.trim() !== "" &&
            formData.location.trim() !== "" &&
            profilePicture !== null &&
            coverPicture !== null
        );
    }, [formData, profilePicture, coverPicture]);

    const handleCompleteProfile = useMutation({
        mutationFn: completeProfile,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }   

    
    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "profile") {
                setProfilePicture(file); // Save as File object
            }
            if (type === "cover") {
                setCoverPicture(file); // Save as File object
            }
        }
    };
    

    const handleLocationSelect = (location) => {
        setFormData({ ...formData, location });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setIsSubmitting(true);
        
        try {
            await handleCompleteProfile.mutateAsync({
                ...formData,
                profilePic:profilePicture,
                coverPic:coverPicture
            });
            console.log("✅ Profile updated successfully.");
            toast("Profile updated successfully");
            setTimeout(() => {
                router.push("/");
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
            handleLocationSelect={handleLocationSelect}
        />
    );
}

export default CompleteProfileContainer;

