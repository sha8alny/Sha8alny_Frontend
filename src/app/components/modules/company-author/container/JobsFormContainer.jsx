"use client";
import React, { useState, useEffect } from "react";
import JobsForm from "../presentation/JobsForm";
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

    useEffect(() => {
        const getJobs = async () => {
            try {
                const jobsData = await postedJobs();
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getJobs();
    }, []);

    return (
        <JobsForm jobs={jobs || []} isLoading={isLoading} />
    );
};

export default JobsFormContainer;