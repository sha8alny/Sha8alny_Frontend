import { useRouter } from "next/navigation";
import { normalizeJob } from "@/app/utils/normalizeJob";
import SavedJobsPresentation from "../presentation/SavedJobsPresentation";
import { fetchSavedJobs } from "@/app/services/jobs";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Container component for managing saved jobs.
 * 
 * Uses react-query to fetch saved jobs data with infinite scrolling capability.
 * Normalizes job data and handles navigation to job details when a job is clicked.
 * 
 * @returns {JSX.Element} The SavedJobsPresentation component with appropriate props
 * for displaying saved jobs, loading states, and handling user interactions.
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
