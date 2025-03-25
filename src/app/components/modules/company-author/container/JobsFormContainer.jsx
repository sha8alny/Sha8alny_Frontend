"use client";
import React, { useState, useEffect } from "react";
import JobsForm from "../presentation/JobsForm";
import PostNewJobContainer from "./PostNewJobContainer";
import JobApplicantsPageContainer from "./JobApplicantsPageContainer";
import { postedJobs } from "../../../../services/companyManagment";
import { useMutation } from "@tanstack/react-query";
import SideBarContainer from "../../company-page-author/container/SideBarContainer";
import Analytics from "../../company-page-author/presentation/Analytics";
import { useRef } from "react";


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
const JobsFormContainer = ({username,logo}) => {
    const [jobs, setJobs] = useState([]);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showJobApplicants, setShowJobApplicants] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const companyUsername = "companyUsername"; 
    useEffect(() => {
        getJobs(companyUsername,
        {onSuccess: (jobsData) =>{
        console.log("Fetched jobs",jobsData);
        setJobs(jobsData);}
        ,onError: (error) =>                 
        console.error("Error fetching jobs:", error)
    });
    }, []);

    const { mutate: getJobs, isPending:isLoading } = useMutation(
        {
            mutationFn: postedJobs,
        }); 


    
        const [logoPreview, setLogoPreview] = useState(logo ||null);
        const logoInputRef = useRef(null);
        const logoUpload = (e) => {
            const selectedFile=e.target.files[0];
            if (selectedFile){
                setLogoPreview(prev => URL.createObjectURL(selectedFile));
                console.log("Current logoPreview:", logoPreview);
            }
        };

        return (
            <div className="flex">
              {showPostJobForm ? (
                <PostNewJobContainer onBack={() => setShowPostJobForm(false)} username={username} logo={logo}  />
              ) : showJobApplicants && selectedJob ? (
                <JobApplicantsPageContainer jobId={selectedJob} onBack={() => setShowJobApplicants(false)} username={username} logo={logo}  />
              ) : (
                <>
                  <SideBarContainer
                    username={username}
                    logoPreview={logoPreview}
                    logoInputRef={logoInputRef}
                    logoUpload={logoUpload}
                  />
                  <JobsForm
                    jobs={jobs || []}
                    isLoading={isLoading}
                    onShowPostJobForm={() => setShowPostJobForm(true)}
                    onShowApplicants={(jobId) => {
                      console.log("selected job", jobId);
                      setSelectedJob(jobId);
                      setShowJobApplicants(true);
                    }}
                  />
                  <Analytics />
                </>
              )}
            </div>
          );
        
};

export default JobsFormContainer;