"use client";
import React, { useState, useEffect } from "react";
import JobsForm from "../presentation/JobsForm";
import PostNewJobContainer from "./PostNewJobContainer";
import JobApplicantsPageContainer from "./JobApplicantsPageContainer";
import { postedJobs } from "../../../../services/companyManagment";
import { useMutation } from "@tanstack/react-query";


/**
 * JobsFormContainer component
 * 
 * This component is responsible for fetching and displaying the list of posted jobs.
 * It handles the state management and data fetching logic.
 * 
 * @component
 * @example
 * return (
 *   <JobsFormContainer />
 * )
 */
const JobsFormContainer = () => {
    const [jobs, setJobs] = useState([]);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showJobApplicants, setShowJobApplicants] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const companyUsername = "companyUsername"; 

    const { mutate: getJobs, isPending:isLoading } = useMutation(
        {
            mutationFn: postedJobs,
            onSuccess: (jobsData) => {
                console.log("Fetched jobs",jobsData);
                setJobs(jobsData);
            },
            onError: (error) => {
                console.error("Error fetching jobs:", error);
            }
        }); 

        useEffect(() => {
            getJobs(companyUsername);
        }, []);
    

    if (showPostJobForm) {
        return <PostNewJobContainer onBack={() => setShowPostJobForm(false)} />;
    }

    if (showJobApplicants && selectedJob) {
        return <JobApplicantsPageContainer jobId={selectedJob} onBack={() => setShowJobApplicants(false)} />;
    }


    return (

        <JobsForm 
        jobs={jobs || []} 
        isLoading={isLoading} 
        onShowPostJobForm={() => setShowPostJobForm(true)}
        onShowApplicants={(jobId) => {
            console.log("selected job",jobId);
            setSelectedJob(jobId);
            setShowJobApplicants(true);
        }}
        />

        
    );
};

export default JobsFormContainer;