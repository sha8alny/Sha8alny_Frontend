"use client";
import { useState } from "react";
import PostNewJobForm from "../presentation/PostNewJobForm";
import {postJob} from "../../../../services/companyManagment";


const PostNewJobContainer = () => {
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        industry: "",
        experience: "",
        salary: "",
        time: new Date().toISOString(),
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setNewJob({ ...newJob, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        
       for (const key in newJob) {
            if (!newJob[key]) {
                newErrors[key] = `${key} is required`;
            }
        };
        return newErrors;
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        try{
            await postJob(newJob);
            alert("Job posted successfully");
            console.log(newJob);
            setNewJob({
                title: "",
                description: "",
                location: "",
                industry: "",
                experience: "",
                salary: "",
                time: new Date().toISOString(),
            });
        } catch (error) {
            alert("Error posting Job, please try again");
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
        />  
    );
};

export default PostNewJobContainer;