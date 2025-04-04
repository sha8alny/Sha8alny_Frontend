"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import  ViewApplicationDetailsModal  from "../presentation/ViewApplicationDetailsModal";
import { getApplication, updateApplication } from "../../../../services/companyManagment";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * ViewApplicationDetailsContainer component
 * 
 * This component handles the logic for fetching and displaying the details of a job application.
 * It manages the state for the application details, status, notes, and modal visibility.
 * It also handles loading and updating states for better user experience.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.jobId - The ID of the job for which the application details are being fetched.
 * @param {string} props.applicantId - The ID of the applicant whose application details are being fetched.
 * @param {Function} props.onClose - Callback function to handle closing the modal.
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <ViewApplicationDetailsContainer jobId="123" applicantId="456" onClose={() => {}} />
 */

const ViewApplicationDetailsContainer = ({jobId, applicantId, onClose}) => {

    const toast = useToast();
    const [application, setApplication] = useState({});
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
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
            setStatus(applicationData.status || "");
        } catch (error) {
            console.error("Error fetching application:", error);
        } finally {
            setIsLoading(false);
        }
    };
    getApplicationDetails();

    }, [jobId, applicantId]);

    useEffect(() => {
        if(application){
            setStatus(application.status||"review");
            setNotes(application.notes||"");
        }
    }, [application]);

    const handleSave = async ()=>{
        setIsUpdating(true);
        try {
            await updateApplication( jobId,applicantId, {status, notes});
            console.log("✅ Application updated successfully.");
            toast("Application updated successfully");
        } catch (error) {
            console.error("❌ Error updating application:", error);
        } finally {
            setIsUpdating(false);
        }
    }
    
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
            status={status}
            notes={notes}
            isUpdating={isUpdating}
            isLoading={isLoading}
            onStatusChange={setStatus}
            onNotesChange={setNotes}
            onClose={closeModal}
            open={openModal}
            onSave={handleSave}
            />
    )

};

export default ViewApplicationDetailsContainer;