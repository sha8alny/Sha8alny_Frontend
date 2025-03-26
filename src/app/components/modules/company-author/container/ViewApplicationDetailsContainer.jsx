"use client";
import { useState, useEffect } from "react";
import  ViewApplicationDetailsModal  from "../presentation/ViewApplicationDetailsModal";
import { getApplication } from "../../../../services/companyManagment";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * ViewApplicationDetailsContainer component
 * 
 * This component handles the logic for fetching and displaying the details of a job application.
 * It manages the state for the application details and the modal visibility.
 * 
 * @component
 * @example
 * return (
 *   <ViewApplicationDetailsContainer />
 * )
 */

const ViewApplicationDetailsContainer = ({jobId, applicantId, onClose}) => {

    const [application, setApplication] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    
    useEffect(() => {
    const getApplicationDetails = async () => {
        if (!jobId || !applicantId) return;
        setIsLoading(true);
        try {
            const applicationData = await getApplication(jobId, applicantId);
            console.log("applicationData",applicationData);
            setApplication(applicationData);
        } catch (error) {
            console.error("Error fetching application:", error);
        } finally {
            setIsLoading(false);
        }
    };
    getApplicationDetails();

    }, [jobId, applicantId]);
    
    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    if (!isOpen) {return null;}

    return(
        <ViewApplicationDetailsModal
            application={application}
            isLoading={isLoading}
            onClose={closeModal}
            open={openModal}
            />
    )

};

export default ViewApplicationDetailsContainer;