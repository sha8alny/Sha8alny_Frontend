"use client";
import { useState, useEffect } from "react";
import JobApplicantsPage from "../presentation/JobApplicantsPage";
import { JobApplicants } from "../../../../services/companyManagment";


const JobApplicantsPageContainer = ({jobId,onBack}) => {
const [applicants, setApplicants] = useState([]);
const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
    const getApplicants = async () => {
        console.log("entered getApplicants");
        try {
            const applicantsData = await JobApplicants(jobId);
            console.log("applicantsData",applicantsData);
            setApplicants(applicantsData);
        }catch (error) {
            console.error("Error fetching applicants:", error);
        }finally {
            setIsLoading(false);
        }
      };
    if(jobId)
        getApplicants();
    }, [jobId]);
    
return (
    <JobApplicantsPage Applicants={applicants || []} isLoading={isLoading} onBack={onBack}/>
);

};

export default JobApplicantsPageContainer;