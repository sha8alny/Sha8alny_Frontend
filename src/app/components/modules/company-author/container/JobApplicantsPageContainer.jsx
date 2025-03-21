"use client";
import { useState, useEffect } from "react";
import JobApplicantsPage from "../presentation/JobApplicantsPage";
import { JobApplicants } from "../../../../services/companyManagment";

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
const JobApplicantsPageContainer = ({jobId,onBack}) => {
const [applicants, setApplicants] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [pageData, setPageData] = useState([]);
const [selectedApplicant, setSelectedApplicant] = useState(null);

   
    const getApplicants = async (pageNumber) => {
        console.log("fetching page",pageNumber);
        if (isLoading || pageData[pageNumber]) return;
        setIsLoading(true);
        try {
            const applicantsData = await JobApplicants(jobId,pageNumber);
            console.log("applicantsData",applicantsData);
            setPageData((prev) => ({ ...prev, [pageNumber]: applicantsData }));
            setApplicants(applicantsData);
            if(applicantsData.length === 0){
                setHasMore(false);
            }
        }catch (error) {
            console.error("Error fetching applicants:", error);
        }finally {
            setIsLoading(false);
        }
      };
      useEffect(() => {
       if (!jobId) return;
        setApplicants([]);
        setPage(1);
        setHasMore(true);
        setPageData([]);
        getApplicants(1);
    
        return () => {
            setIsLoading(false);
             };
    }, [jobId]);

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
    if (selectedApplicant === applicantId) {
        setSelectedApplicant(null);
        setTimeout(() => setSelectedApplicant(applicantId), 0);
    } else {
        setSelectedApplicant(applicantId);
    }
};

/**
 * Handles closing the application details modal.
 * Sets the selected applicant to null.
 */
const closeApplicationDetails = () => {
    setSelectedApplicant(null);
};

return (
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
);

};

export default JobApplicantsPageContainer;