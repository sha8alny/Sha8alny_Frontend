"use client";
import { useState } from "react";
import PostNewJobForm from "../presentation/PostNewJobForm";
import { postJob } from "../../../../services/companyManagment";

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
const PostNewJobContainer = ({ onBack }) => {
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        workLocation: "",
        employmentType: "",
        industry: "",
        experience: "",
        salary: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    /**
     * Handles input changes and updates the new job state.
     * 
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewJob({ ...newJob, [name]: value });
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
    const handleJobSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        setAlert(null);
        try{
            await postJob(newJob);
            setAlert({ type: "success", message: "Job posted successfully" });
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
            console.log(newJob);
            setErrors({});
        } catch (error) {
            setAlert({ type: "error", message: "Error posting job" });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <PostNewJobForm
            newJob={newJob}
            handleChange={handleChange}
            errors={errors}
            isLoading={isLoading}
            handleJobSubmit={handleJobSubmit}
            onBack={onBack}
            alert={alert}
        />  
    );
};

export default PostNewJobContainer;