import React from "react";
import { useRouter } from "next/navigation";

import MyJobsPresentation from "../presentation/MyJobsPresentation";
import { useQuery } from "@tanstack/react-query";
import { fetchAppliedJobs } from "@/app/services/jobs";


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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobApplications"],
    queryFn: () => fetchAppliedJobs(),
    enabled: true,
  });
  
  return {
    data,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
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

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useJobApplications();

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
  const jobs = data || [];

  // Loading state
  if (isLoading) {
    return <div className="text-center py-8">Loading job listings...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading job listings: {error.message}
      </div>
    );
  }

  return (
    <MyJobsPresentation
      jobs={jobs}
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
