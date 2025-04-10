import { useState, useEffect } from "react";
import useJobDetails from "@/app/hooks/useJobDetails";
import { normalizeJob } from "@/app/utils/normalizeJob";
import { useMutation } from "@tanstack/react-query";
import { saveJob } from "@/app/services/jobs";
import JobDetailsPresentation from "../presentation/JobDetailsPresentation";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobDetailsContainer component fetches job details and manages all data and state
 * before passing to the presentation component.
 *
 * This is a container component responsible for:
 * - Data fetching
 * - State management
 * - Error handling
 * - API interactions
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function JobDetailsContainer() {
  const [error, setError] = useState(null);
  const { job, isLoading, isError, errorMessage, refetch } = useJobDetails();
  const [normalizedJob, setNormalizedJob] = useState(null);
  
  // Update normalized job when the job data changes
  useEffect(() => {
    if (job) {
      setNormalizedJob(normalizeJob(job));
    }
  }, [job]);

  // State for save job functionality
  const [isSaving, setIsSaving] = useState(false);

  // Single mutation for both saving and unsaving jobs
  const mutation = useMutation({
    mutationFn: ({ jobId, action }) => saveJob(jobId, action),
    onSuccess: () => {
      // Handle success (e.g., show a success message)
      setError(null);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      setError(error.message || "Failed to toggle job save status");
      console.error("Failed to toggle job save status:", error);
    },
  });

  /**
   * Handles saving or unsaving a job
   * @param {string} jobId - The ID of the job
   * @param {boolean} isSaved - Whether the job is currently saved
   * @returns {Promise} A promise that resolves when the operation completes
   */
  const handleSaveJob = (jobId, isSaved) => {
    setIsSaving(true);
    const action = isSaved ? 'unsave' : 'save';
    
    return new Promise((resolve, reject) => {
      mutation.mutate({ jobId, action }, {
        onSuccess: () => {
          // Update the local job state
          if (normalizedJob) {
            setNormalizedJob({
              ...normalizedJob,
              isSavedByUser: !isSaved
            });
          }
          setIsSaving(false);
          resolve();
        },
        onError: (error) => {
          setIsSaving(false);
          reject(error);
        }
      });
    });
  };

  const handleRetry = () => {
    setError(null);
    mutation.reset(); // Reset the mutation state to clear any previous errors
    refetch().catch(err => {
      setError(err.message || "Failed to refetch job details");
      console.error("Failed to refetch job details:", err);
    });
  };

  return (
    <JobDetailsPresentation
      job={normalizedJob}
      isLoading={isLoading}
      isError={isError || !!error}
      errorMessage={error || errorMessage || "An error occurred"}
      onSaveJob={handleSaveJob}
      isSaving={isSaving}
      onRetry={handleRetry}
    />
  );
}

export default JobDetailsContainer;