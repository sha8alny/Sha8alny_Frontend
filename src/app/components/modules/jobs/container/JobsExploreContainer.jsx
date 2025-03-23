import useJobListings from "@/hooks/useJobListings";
import JobsExplorePresentation from "../presentation/JobsExplorePresentation";
import { useRouter } from "next/navigation";
import { normalizeJob } from "@/app/utils/normalizeJob";

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
    isFetchingNextPage,
  } = useJobListings(jobListingsOverride);

  const jobsData = data?.pages.flatMap((page) => normalizeJob(page.data));

  const router = useRouter();
  const handleJobClick = (job) => {
    router.push(
      `/jobs/${job.id}?title=${encodeURIComponent(
        job.title || "Job Opening"
      )}&company=${encodeURIComponent(job.company.name)}`
    );
  };
  return (
    <JobsExplorePresentation
      data={jobsData}
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
