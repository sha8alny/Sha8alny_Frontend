"use client";
import { useEffect, useState } from "react";
import PostNewJobForm from "../presentation/PostNewJobForm";
import { postJob } from "../../../../services/companyManagment";
import { useMutation } from "@tanstack/react-query";
import SideBarContainer from "../../company-page-author/container/SideBarContainer";
import Analytics from "../../company-page-author/presentation/Analytics";
import { useRef } from "react";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * PostNewJobContainer component
 * 
 * This component is responsible for handling the state and logic for posting a new job.
 * It includes form validation, state management, and submission handling.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {Function} props.onBack - The function to call when the back button is clicked.
 * 
 * @example
 * return (
 *   <PostNewJobContainer onBack={handleBack} />
 * )
 */
const PostNewJobContainer = ({ onBack,username,logo }) => {
    const [logoPreview, setLogoPreview] = useState(logo ||null);
    const logoInputRef = useRef(null);
    const logoUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            setLogoPreview(prev => URL.createObjectURL(selectedFile));
            console.log("Current logoPreview:", logoPreview);
        }
    };
    const [newJob, setNewJob] = useState({
        title: "",
        location: "",
        workLocation: "",
        employmentType: "",
        description: "",
        industry: "",
        experience: "",
        salary: "",
    });

    const [errors, setErrors] = useState({});
    const toast = useToast();

    /**
     * Handles input changes and updates the new job state.
     * 
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setNewJob((prevJob) => ({
            ...prevJob,
            [name]: name === "salary" ? (value === "" ? "" : Number(value)) : value, // Proper number conversion
        }));
    };
    
    /**
     * Validates the job form fields.
     * 
     * @returns {Object} An object containing validation errors, if any.
     */
    const validateForm = () => {
        let newErrors = {};
        
        for (const key in newJob) {
            if (!newJob[key]) {
                newErrors[key] = `${key} is required`;
            }
        }
        return newErrors;
    };

    /**
     * Handles the job form submission.
     * Validates the form, posts the job, and sets the appropriate alert messages.
     * 
     * @param {Object} e - The event object.
     */

    const {mutate: JobSubmit, isPending: isLoading} = useMutation({
        mutationFn: postJob
    });

    const handleJobSubmit =(e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Validation Errors: ", validationErrors);
            return;
        }
        console.log(typeof newJob.salary, newJob.salary);

        JobSubmit({jobData:newJob,username: username},
             {onSuccess: () => {
                toast("Job posted successfully!", "success");
                setNewJob({
                    title: "",
                    description: "",
                    location: "",
                    workLocation: "",
                    employmentType: "",
                    industry: "",
                    experience: "",
                    salary: "",
                });
                setErrors({});
            },
            onError: (error) => {
                toast("Error posting job",false);
                console.log("Error Posting Job:",error);
            }}
        );
    };

    return (
      <div className="flex w-full">
        <SideBarContainer
        username={username}
        logoPreview={logoPreview}
        logoInputRef={logoInputRef}
        logoUpload={logoUpload}
        />
        <PostNewJobForm
            newJob={newJob}
            handleChange={handleChange}
            errors={errors}
            isLoading={isLoading}
            handleJobSubmit={handleJobSubmit}
            onBack={onBack}
        />  
        <Analytics />

        </div>
    );
};

export default PostNewJobContainer;