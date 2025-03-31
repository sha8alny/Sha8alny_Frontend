import useJobDetails from "@/app/hooks/useJobDetails";
import JobDetailsPresentation from "../presentation/JobDetailsPrenestation";
import { normalizeJob } from "@/app/utils/normalizeJob";
import { useMutation } from "@tanstack/react-query";
import { saveJob } from "@/app/services/jobs";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobDetailsContainer component fetches job details using the useJobDetails hook
 * and passes the data to the JobDetailsPresentation component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function JobDetailsContainer() {
  const mutation = useMutation({
    mutationFn: (jobId) => saveJob(jobId),
    onSuccess: () => {
      // Handle success (e.g., show a success message)
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      setError(error.message || "Failed to save job");
    },
  });
  const handleSaveJob = (jobId) => {
    mutation.mutate(jobId);
  };
  const { job, isLoading, isError, errorMessage } = useJobDetails();
  const normalizedJob = job ? normalizeJob(job) : null;
  return (
    <JobDetailsPresentation
      handleSaveJob={handleSaveJob}
      job={normalizedJob}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
    />
  );
}

export default JobDetailsContainer;
