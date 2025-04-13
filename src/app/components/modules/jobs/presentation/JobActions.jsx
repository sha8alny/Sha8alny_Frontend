import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import JobApplicationModalContainer from "../container/JobApplicationModalContainer";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobActions component renders action buttons for a job listing.
 * Pure presentation component that receives all data and handlers from container.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.job - The normalized job object containing job details.
 * @param {string} props.job.id - The unique identifier of the job.
 * @param {string} props.job.title - The title of the job.
 * @param {boolean} props.job.isSavedByUser - Whether the job is saved by the user.
 * @param {Function} props.onSaveJob - Function to handle saving/unsaving a job.
 * @param {boolean} props.isSaving - Whether a save operation is in progress.
 *
 * @returns {JSX.Element} The rendered JobActions component.
 */
export default function JobActions({ 
  job, 
  onSaveJob, 
  isSaving = false
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSavedByUser);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveClick = () => {
    onSaveJob(job.id, isSaved);
  };
  
  // Update local state when prop changes
  useEffect(() => {
    setIsSaved(job.isSavedByUser);
  }, [job.isSavedByUser]);

  return (
    <div className="mt-8 flex space-x-4">
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-6 py-2 text-white dark:text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200  text-sm font-medium rounded-md shadow-md"
        aria-label="Apply for this job"
      >
        <CheckCircleIcon className="h-5 w-5" />
        Apply Now
      </button>

      {modalOpen && (
        <JobApplicationModalContainer
          show={modalOpen}
          handleClose={handleCloseModal}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}

      <button
        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition duration-300 ${
          isSaved
            ? "text-white dark:text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
            : "border border-secondary text-secondary  hover:bg-secondary/80"
        }`}
        onClick={handleSaveClick}
        disabled={isSaving}
        aria-label={isSaved ? "Unsave this job" : "Save this job"}
        title={isSaved ? "Remove from saved jobs" : "Add to saved jobs"}
      >
        <BookmarkIcon
          className={`h-5 w-5 ${
            isSaved ? "text-background" : "text-secondary"
          }`}
        />
        {isSaving ? "Loading..." : isSaved ? "Saved" : "Save Job"}
      </button>
    </div>
  );
}