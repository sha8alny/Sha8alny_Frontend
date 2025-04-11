import React from "react";
import { useRouter } from "next/navigation";

import MyJobsPresentation from "../presentation/MyJobsPresentation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAppliedJobs, fetchArchivedJobs, fetchInProgressJobs } from "@/app/services/jobs";

/**
 * @namespace my-items
 * @module my-items
 */
/**
 * Custom hook to fetch jobs data with specific status.
 * 
 * @function
 * @param {string} queryKey - The query key identifier for React Query
 * @param {Function} fetchFn - The function to fetch the data
 * @param {string} status - The status to assign to the jobs
 * @returns {Object} Object containing job data and query states
*/
const useJobsWithStatus = (queryKey, fetchFn, status) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchFn,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  
  // Flatten the pages data into a single array and assign status
  const flattenedData = data?.pages?.flatMap(page => 
    page.data.map(job => ({
      ...job,
      // Only set status if it's not already defined in the API response
      status: job.status || status
    }))
  ) || [];
  
  return {
    data: flattenedData,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  };
};

/**
 * MyJobsContainer component that fetches and manages the user's job applications.
 * 
 * This component serves as a container that fetches job application data using react-query,
 * provides utility functions for formatting and styling, and handles navigation events.
 * It passes all necessary props to the presentational component.
 * 
 * @component
 * @returns {JSX.Element} The rendered component that displays user's job applications or loading/error states
 */
function MyJobsContainer() {
  const router = useRouter();

  // Use our custom hook for each job type with appropriate status
  const appliedJobs = useJobsWithStatus("jobApplications", fetchAppliedJobs, "pending");
  const archivedJobs = useJobsWithStatus("jobArchived", fetchArchivedJobs, "rejected");
  const inProgressJobs = useJobsWithStatus("jobInProgress", fetchInProgressJobs, "accepted");

  const handleJobClick = (job) => {
    router.push(
      `/jobs/${job._id}?title=${encodeURIComponent(
        job.title || "Job Opening"
      )}&company=${encodeURIComponent(job.companyData.name)}`
    );
  };

  const handleMoreJobsClick = () => {
    router.push("/jobs");
  };

  // Format utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "viewed":
        return "bg-blue-200 text-blue-800";
      case "pending":
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Check if any of the queries are loading
  const isLoading = appliedJobs.isLoading || archivedJobs.isLoading || inProgressJobs.isLoading;

  // Check if all queries have completed but returned errors
  const isAllError = appliedJobs.isError && archivedJobs.isError && inProgressJobs.isError;

  // Combine all jobs from different sources
  const allJobs = [
    ...appliedJobs.data,
    ...archivedJobs.data,
    ...inProgressJobs.data
  ];

  // Combined loading state
  if (isLoading) {
    return <div className="text-center py-8">Loading job listings...</div>;
  }

  // If all queries failed, show error
  if (isAllError) {
    return (
      <div className="text-center py-8 text-red-500">
        <span>Error loading job listings</span> 
      </div>
    );
  }

  // If some queries succeeded but others failed, show a warning but still display the data
  const hasPartialError = appliedJobs.isError || archivedJobs.isError || inProgressJobs.isError;
  const errorMessage = hasPartialError ? "Some job data could not be loaded." : null;

  // Determine if any category has more jobs to load
  const hasMoreJobs = appliedJobs.hasNextPage || archivedJobs.hasNextPage || inProgressJobs.hasNextPage;

  // Function to load more jobs from all categories that have more
  const loadMoreJobs = () => {
    if (appliedJobs.hasNextPage) {
      appliedJobs.fetchNextPage();
    }
    if (archivedJobs.hasNextPage) {
      archivedJobs.fetchNextPage();
    }
    if (inProgressJobs.hasNextPage) {
      inProgressJobs.fetchNextPage();
    }
  };

  // Check if any category is currently fetching more
  const isLoadingMore = appliedJobs.isFetchingNextPage || 
                        archivedJobs.isFetchingNextPage || 
                        inProgressJobs.isFetchingNextPage;

  return (
    <MyJobsPresentation
      jobs={allJobs}
      formatDate={formatDate}
      formatTime={formatTime}
      getStatusColor={getStatusColor}
      onMoreJobsClick={handleMoreJobsClick}
      onJobClick={handleJobClick}
      hasMoreJobs={hasMoreJobs}
      loadMoreJobs={loadMoreJobs}
      isLoadingMore={isLoadingMore}
      errorMessage={errorMessage}
    />
  );
}

export default MyJobsContainer;