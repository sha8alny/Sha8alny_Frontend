
"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchJobListings } from "@/app/services/search";
import JobSectionAllPresentation from "../presentation/JobSectionAllPresentation";
import { normalizeJob } from "@/app/utils/normalizeJob";
/**
 * @namespace search
 * @module search
 * Container component for the "All Jobs" section on the search page.
 * Fetches job listings data based on the provided query and handles navigation logic.
 * 
 * @param {Object} props Component props
 * @param {string} props.query Search query string to fetch relevant job listings
 * @returns {JSX.Element} Rendered JobSectionAllPresentation component with job data and handlers
 */
const JobSectionAllContainer = ({ query }) => {
  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobListings", query],
    queryFn: () => fetchJobListings(query, 1),
  
  });

  const router = useRouter();

  const handleViewMore = () => {
    router.push("/jobs?keyword=" + query);
  };
  const handleJobClick = (jobId) => {
    router.push("/jobs/" + jobId);
  };
  const normalizedJobs = jobs?.map((job) => normalizeJob(job)) || [];

  return (
    <JobSectionAllPresentation
      jobs={normalizedJobs}
      isLoading={isLoading}
      isError={isError}
      onViewMore={handleViewMore}
      handleJobClick={handleJobClick}
      error={error?.message}
    />
  );
};

export default JobSectionAllContainer;
