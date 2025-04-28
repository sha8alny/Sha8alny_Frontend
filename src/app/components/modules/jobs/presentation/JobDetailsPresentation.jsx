import React from "react";
import JobHeader from "./JobHeader";
import JobError from "./JobError";
import JobContent from "./JobContent";
import JobActions from "./JobActions";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobDetailsPresentation component renders the details of a job.
 * Pure presentation component that receives all data and handlers from container.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.job - The job data to display.
 * @param {boolean} props.isLoading - Flag indicating if the job data is still loading.
 * @param {boolean} props.isError - Flag indicating if there was an error loading the job data.
 * @param {string} props.errorMessage - The error message to display if there was an error.
 * @param {Function} props.onSaveJob - Function to handle saving/unsaving jobs.
 * @param {boolean} props.isSaving - Whether a save operation is in progress.
 * @param {Function} props.onRetry - Function to retry loading on error.
 *
 * @returns {JSX.Element} The rendered component.
 */
function JobDetailsPresentation({
  job,
  isLoading,
  isError,
  errorMessage,
  onSaveJob,
  isSaving,
  onRetry
}) {
  // Handle error states
  if (isError) {
    return <JobError errorMessage={errorMessage || "An error occurred"} onRetry={onRetry} />;
  }

  return (
    <div className="job-details">
      <JobHeader job={job || {}} isLoading={isLoading} />
      <JobContent job={job || {}} isLoading={isLoading} />
      {!isLoading && job && (
        <JobActions 
          job={job} 
          onSaveJob={onSaveJob} 
          isSaving={isSaving} 
        />
      )}
    </div>
  );
}

export default JobDetailsPresentation;