import useJobListings from "@/hooks/useJobListings";
import JobsExplorePresentation from "../presentation/JobsExplorePresentation";
import { useRouter } from "next/navigation";

/**
 * JobsCardContainer component fetches and displays job listings.
 * It supports pagination and can accept an override list of job listings.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.jobListingsOverride - An optional array of job listings to override the fetched data.
 * @returns {JSX.Element} The rendered component.
 */

function JobsCardContainer({ jobListingsOverride = [] }) {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useJobListings(jobListingsOverride);
  
  const router = useRouter();
  const handleJobClick = (job) => {
      router.push(`/jobs/${job.job_id}?title=${encodeURIComponent(job.title || 'Job Opening')}&company=${encodeURIComponent(job.company_data.name)}`);
  };
  
  return (
    <JobsExplorePresentation
      data={data}
      error={error}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      handleJobClick={handleJobClick}
    />
  );
}

export default JobsCardContainer;
