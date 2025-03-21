"use client";
import React, { useState, useEffect } from "react";
import JobsForm from "../presentation/JobsForm";
import PostNewJobContainer from "./PostNewJobContainer";
import JobApplicantsPageContainer from "./JobApplicantsPageContainer";
import { postedJobs } from "../../../../services/companyManagment";


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
    const [isLoading, setIsLoading] = useState(false);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showJobApplicants, setShowJobApplicants] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const getJobs = async () => {
            setIsLoading(true);
            try {
                const jobsData = await postedJobs();
                console.log("Fetched jobs:",jobsData);
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getJobs();
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