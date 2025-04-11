"use client";
import React, { useState, useEffect } from "react";
import JobsForm from "../presentation/JobsForm";
import PostNewJobContainer from "./PostNewJobContainer";
import JobApplicantsPageContainer from "./JobApplicantsPageContainer";
import { postedJobs, deleteJob, editJob } from "../../../../services/companyManagment";
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showJobApplicants, setShowJobApplicants] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [updatedJob, setUpdatedJob] = useState(null);
    const toast = useToast();

    const { mutate: getJobs, isPending:isLoading } = useMutation(
      {
          mutationFn: postedJobs,
      }); 

    useEffect(() => {
       const fetchJobs = async () => {
         getJobs({ page, companyUsername: username },{
          onSuccess: (jobsData) => {
            console.log("jobsData", jobsData);
           if (jobsData && jobsData.length > 0) {
            setJobs(jobsData) 
           getJobs({ page: page + 1, companyUsername: username },{
            onSuccess: (nextData) => {
              setHasMore(nextData.length > 0);
           },
           onError: (error) => {
            console.error("Error fetching next page of jobs:", error);
            setHasMore(false);
          }
          });
          }
        },
          onError: (error) => {
            console.error("Error fetching jobs:", error);
            setHasMore(false);
          }
          });

        };
        fetchJobs();
    }, [page, username, getJobs]);

    const handleDeleteJob = async ( jobId, username) => {
         try{
          const response = await deleteJob({companyUsername:username,jobId});
          if (response){
            toast("Job deleted successfully!");
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
          }
          else{
            toast("Error deleting job", false);
          }
         }
          catch (error) {
            console.error("Error deleting job:", error);
            toast("Error deleting job", false);
          }
      };  

    const handleEditJob = async (jobId, username) => {
        try {
          const response = await editJob({ companyUsername: username, jobId, jobData: updatedJob });
          if (response) {
            toast("Job updated successfully!");
            setJobs((prevJobs) =>
              prevJobs.map((job) => (job._id === jobId ? { ...job, ...updatedJob } : job))
            );
          } else {
            toast("Error updating job", false);
          }
        } catch (error) {
          console.error("Error updating job:", error);
          toast("Error updating job", false);
        }
      };

    
        const [logoPreview, setLogoPreview] = useState(logo ||null);
        const logoInputRef = useRef(null);
        const logoUpload = (e) => {
            const selectedFile=e.target.files[0];
            if (selectedFile){
                setLogoPreview(prev => URL.createObjectURL(selectedFile));
            }
        };
        const nextPage = () => {
          if (hasMore) {
            setPage((prev) => prev + 1);
          }
        }
        const prevPage = () => {
          setPage((prev) => Math.max(prev - 1, 1));
        }
        

        return (
            <div className="flex">
              {showPostJobForm ? (
                <PostNewJobContainer onBack={() => setShowPostJobForm(false)} username={username} logo={logo} initialJobData={null}  />
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
                    page={page}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    hasMore={hasMore}
                    onDeleteJob={(jobId)=> handleDeleteJob(jobId,username)}
                    setUpdatedJob={setUpdatedJob}
                    onEditJob={(jobId) => handleEditJob(jobId, username)}
                  />
                  <Analytics />
                </>
              )}
            </div>
          );
        
};

export default JobsFormContainer;