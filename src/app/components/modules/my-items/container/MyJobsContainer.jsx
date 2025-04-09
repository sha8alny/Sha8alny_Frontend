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
 * Custom hook to fetch job applications data.
 * 
 * @function
 * @returns {Object} Object containing job applications data and query states
 * @property {Array} data - The job applications data
 * @property {boolean} isLoading - Loading state of the query
 * @property {boolean} isError - Error state of the query
 * @property {string|null} errorMessage - Error message if query failed, null otherwise
*/
const useJobApplications = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["jobApplications"],
    queryFn: fetchAppliedJobs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  
  // Flatten the pages data into a single array
  const flattenedData = data?.pages?.flatMap(page => page.data) || [];
  
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
const useJobArchived = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["jobArchived"],
    queryFn: fetchArchivedJobs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  
  // Flatten the pages data into a single array
  const flattenedData = data?.pages?.flatMap(page => page.data) || [];
  
  return {
    data: flattenedData,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  };
}
const useJobInProgress = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["jobInProgress"],
    queryFn: fetchInProgressJobs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  
  // Flatten the pages data into a single array
  const flattenedData = data?.pages?.flatMap(page => page.data) || [];
  
  return {
    data: flattenedData,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  };
}

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

  const {
    data,
    isLoading,
    isError,
    errorMessage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useJobApplications();
  const {
    data: archivedData,
    isLoading: isLoadingArchived,
    isError: isErrorArchived,
    errorMessage: errorMessageArchived,
    hasNextPage: hasNextPageArchived,
    fetchNextPage: fetchNextPageArchived,
    isFetchingNextPage: isFetchingNextPageArchived,
  } = useJobArchived();
  const {
    data: inProgressData,
    isLoading: isLoadingInProgress,
    isError: isErrorInProgress,
    errorMessage: errorMessageInProgress,
    hasNextPage: hasNextPageInProgress,
    fetchNextPage: fetchNextPageInProgress,
    isFetchingNextPage: isFetchingNextPageInProgress,
  } = useJobInProgress();


  const handleJobClick = (job) => {
    router.push(
      `/jobs/${job._id}?title=${encodeURIComponent(
        job.title || "Job Opening"
      )}&company=${encodeURIComponent(job.companyData.name)}`
    );
  };

  const handleMoreJobsClick = () => {
    // Handle apply click
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

  

  // Extract jobs from the paginated data structure
  // Extract jobs from the paginated data structure and set status
  const jobs = data?.map(job => ({ ...job, status: 'pending' })) || [];
  const archivedJobs = archivedData?.map(job => ({ ...job, status: 'rejected' })) || [];
  const inProgressJobs = inProgressData?.map(job => ({ ...job, status: 'accepted' })) || [];
  const allJobs = [...jobs, ...archivedJobs, ...inProgressJobs];
  const allJobsLength = allJobs.length;
  
  

  // Loading state
  if (isLoading || isLoadingArchived || isLoadingInProgress) {
    return <div className="text-center py-8">Loading job listings...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
       <span>Error loading job listings: {errorMessage}</span> 
      </div>
    );
  }
  if (isErrorArchived) {
    return (
      <div className="text-center py-8 text-red-500">
       <span>Error loading job listings: {errorMessageArchived}</span> 
      </div>
    );
  }
  if (isErrorInProgress) {
    return (
      <div className="text-center py-8 text-red-500">
       <span>Error loading job listings: {errorMessageInProgress}</span> 
      </div>
    );
  }

  return (
    <MyJobsPresentation
      jobs={allJobs}
      formatDate={formatDate}
      formatTime={formatTime}
      getStatusColor={getStatusColor}
      onMoreJobsClick={handleMoreJobsClick}
      onJobClick={handleJobClick}
      hasMoreJobs={hasNextPage}
      loadMoreJobs={fetchNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  );
}

export default MyJobsContainer;
