import useJobDetails from "@/hooks/useJobDetails";
import JobDetailsPresentation from "../presentation/JobDetailsPrenestation";
import { normalizeJob } from "@/app/utils/normalizeJob";

/**
 * JobDetailsContainer component fetches job details using the useJobDetails hook
 * and passes the data to the JobDetailsPresentation component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */

function JobDetailsContainer() {
  const { job, isLoading, isError, errorMessage } = useJobDetails();
  const normalizedJob = job ? normalizeJob(job) : null;
  return (
    <JobDetailsPresentation
      job={normalizedJob}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
    />
  );
}

export default JobDetailsContainer;
