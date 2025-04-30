import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import JobActions from "../presentation/JobActions";
import { report } from "@/app/services/privacy";

/**
 * Container component for JobActions that handles business logic
 * 
 * @param {Object} props - Component props
 * @param {Object} props.job - Job object
 * @param {Function} props.onSaveJob - Function to handle saving/unsaving a job
 * @param {boolean} props.isSaving - Whether a save operation is in progress
 * @returns {JSX.Element} JobActions presentation component
 */
export default function JobActionsContainer({ job, onSaveJob, isSaving }) {
  // Local state management
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSavedByUser);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportState, setReportState] = useState(0); // 0: initial, 1: loading, 2: success, 3: error
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState("");

  // Update local saved state when prop changes
  useEffect(() => {
    setIsSaved(job.isSavedByUser);
  }, [job.isSavedByUser]);

  const handleReportMutation = useMutation({
    mutationFn: (params) => {
      const { jobId, reportObj } = params;
      console.log("Reporting job with ID:", jobId, "and reason:", reportObj);
      return report(null, null, null, jobId, null, reportObj);
    },
  });

  // Action handlers
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenReportModal = () => {
    console.log("Opening report modal");
    // Reset form fields first
    setReportText("");
    setReportType("");
    setReportState(0);
    // Then open modal - this ensures clean state
    setReportModalOpen(true);
  };

  const handleCloseReportModal = (open) => {
    console.log("Dialog onOpenChange called with:", open);
    setReportModalOpen(open);

    if (!open && reportState !== 1) {
      setReportText("");
      setReportType("");
      setReportState(0);
    }
  };

  const handleSaveClick = () => {
    onSaveJob(job.id, isSaved);
  };

  // Handle job report submission
  const handleReport = async () => {
    if (!reportType || (reportType === "Something Else" && !reportText.trim()))
      return;

    if (!job?.id) {
      console.error("Cannot report: jobId is missing or invalid.", job);
      setReportState(3); // Error state
      setTimeout(() => {
        setReportModalOpen(false);
        setReportState(0); // Reset state after delay
      }, 2000);
      return;
    }

    const reportObj = {
      reason: reportType,
      text: reportType === "Something Else" ? reportText : null,
    };

    setReportState(1); // Set loading state

    try {
      await handleReportMutation.mutateAsync({ jobId: job.id, reportObj });
      setReportState(2); // Success state

      // Use setTimeout to give users time to see the success message
      setTimeout(() => {
        setReportModalOpen(false);
        setReportText("");
        setReportType("");
        setReportState(0);
      }, 2000);
    } catch (error) {
      console.error("Error reporting job:", error);
      setReportState(3); // Error state

      // Use setTimeout for error message as well
      setTimeout(() => {
        setReportModalOpen(false);
        setReportText("");
        setReportType("");
        setReportState(0);
      }, 2000);
    }
  };

  return (
    <JobActions
      job={job}
      onSaveJob={handleSaveClick}
      isSaving={isSaving}
      isSaved={isSaved}
      modalOpen={modalOpen}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      reportModalOpen={reportModalOpen}
      handleOpenReportModal={handleOpenReportModal}
      handleCloseReportModal={handleCloseReportModal}
      reportState={reportState}
      reportText={reportText}
      setReportText={setReportText}
      reportType={reportType}
      setReportType={setReportType}
      onReport={handleReport}
    />
  );
}
