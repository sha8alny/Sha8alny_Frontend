"use client";
import { useState, useEffect } from "react";
import JobApplicantsPage from "../presentation/JobApplicantsPage";
import { JobApplicants } from "../../../../services/companyManagment";
import { useRef } from "react";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * JobApplicantsPageContainer component
 * 
 * This component is responsible for fetching and displaying the list of job applicants for a specific job.
 * It handles pagination, state management, and data fetching logic.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.jobId - The ID of the job for which applicants are being displayed.
 * @param {Function} props.onBack - The function to call when the back button is clicked.
 * 
 * @example
 * return (
 *   <JobApplicantsPageContainer jobId={jobId} onBack={handleBack} />
 * )
 */
const JobApplicantsPageContainer = ({jobId,onBack, username, logo}) => {
const [logoPreview, setLogoPreview] = useState(logo ||null);
const logoInputRef = useRef(null);
const logoUpload = (e) => {
    const selectedFile=e.target.files[0];
    if (selectedFile){
        setLogoPreview(prev => URL.createObjectURL(selectedFile));
    }
};
const [applicants, setApplicants] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [selectedApplicant, setSelectedApplicant] = useState(null);
useEffect(() => {
    if (!jobId) return;
    resetState();
    getApplicants(1);

 }, [jobId]);
   // Helper function to reset state when jobId changes
   const resetState = () => {
    setApplicants([]);
    setPage(1);
    setHasMore(true);
    setSelectedApplicant(null);
  };


const getApplicants = async (pageNumber) => {
        console.log("fetching page",pageNumber);
        if (isLoading || !jobId) return;
        setIsLoading(true);
        try {
            const applicantsData = await JobApplicants(jobId,pageNumber);
            console.log("applicantsData",applicantsData);
            if (applicantsData && applicantsData.length > 0) 
            setApplicants(applicantsData);
            const nextData = await JobApplicants(jobId,pageNumber + 1);
            if (nextData && nextData.length > 0) {
                setHasMore(true);
            }
            else {
                setHasMore(false);
            }

         console.log("hasMore",hasMore);
        }catch (error) {
            console.error("Error fetching applicants:", error);
        }finally {
            setIsLoading(false);
        }
      };


    /**
 * Handles the next page button click.
 * Fetches the next page of applicants if there are more applicants to fetch.
 */   
    
const nextPage = () => {
    if(hasMore){
        const nextPage = page + 1;
        setPage(nextPage);
        getApplicants(nextPage);
    }
};

/**
 * Handles the previous page button click.
 * Fetches the previous page of applicants if the current page is greater than 1.
 */
const prevPage = () => {
    if(page > 1){
        const prevPage = page - 1;
        setPage(prevPage);
        getApplicants(prevPage);
    }
};

/**
 * Handles the view application button click.
 * Sets the selected applicant to view their details.
 * 
 * @param {string} applicantId - The ID of the applicant to view.
 */

const viewApplication = (applicantId) => {
    setSelectedApplicant(null);
    setTimeout(() => {
        setSelectedApplicant(applicantId);
    }, 100);
};


/**
 * Handles closing the application details modal.
 * Sets the selected applicant to null.
 */
const closeApplicationDetails = () => {
    setSelectedApplicant(null);
};

return (
    <div className="flex w-full">
    <JobApplicantsPage 
    Applicants={applicants || []}
     isLoading={isLoading} 
     onBack={onBack}
     onNext={nextPage}
     onPrev={prevPage}
     hasMore={hasMore}
     currentPage={page}
     jobId={jobId}
     onViewApplication={viewApplication}
     selectedApplicant={selectedApplicant}
    onCloseApplicationDetails={closeApplicationDetails}
     />
    </div>
);

};

export default JobApplicantsPageContainer;