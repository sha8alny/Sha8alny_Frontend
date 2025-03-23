// JobsContainer.jsx
import React from "react";
import { useRouter } from "next/navigation";

import MyJobsPresentation from "../presentation/MyJobsPresentation";
import { useQuery } from "@tanstack/react-query";
import { fetchAppliedJobs } from "@/app/services/jobs";
import { data } from "autoprefixer";

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
