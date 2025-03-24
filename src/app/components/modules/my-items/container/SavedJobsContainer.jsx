import { useRouter } from "next/navigation";
import { normalizeJob } from "@/app/utils/normalizeJob";
import SavedJobsPresentation from "../presentation/SavedJobsPresentation";
import { fetchSavedJobs } from "@/app/services/jobs";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * JobsCardContainer component fetches and displays job listings.
 * It supports pagination and can accept an override list of job listings.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */


function SavedJobsContainer() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({    
    queryKey: ["jobListings"],
    queryFn: fetchSavedJobs,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  const jobsData = data?.pages.flatMap((page) => Array.isArray(page.data) ? page.data.map(normalizeJob) : [normalizeJob(page.data)]);

  const router = useRouter();
  const handleJobClick = (job) => {
    router.push(
      `/jobs/${job.id}?title=${encodeURIComponent(
        job.title || "Job Opening"
      )}&company=${encodeURIComponent(job.company.name)}`
    );
  };
  return (
    <SavedJobsPresentation
      savedJobs={jobsData}
      error={error}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      handleJobClick={handleJobClick}
      handleMoreJobsClick={() => router.push("/jobs")}
    />
  );
}

export default SavedJobsContainer;
