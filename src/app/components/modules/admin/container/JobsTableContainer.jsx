"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobListings } from "@/app/services/jobs";
import { deleteJob } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";
import { JobsTablePresentation } from "../presentation/JobsTablePresentation";
import { useRouter } from "next/navigation";
/**
 * @namespace admin
 * @module admin
 */
/**
 * JobsTableContainer component is responsible for fetching and managing job listings data
 * for the admin panel. It handles pagination, deletion of jobs, and displays the data
 * using the JobsTablePresentation component.
 *
 * @component
 * 
 */

export function JobsTableContainer() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobsAdmin", debouncedQuery, page],
    queryFn: () =>
      fetchJobListings({
        pageParam: page,
        filters: { keyword: debouncedQuery }, 
        itemsPerPage: 5,
      }),
    keepPreviousData: true, 
  });

  const handleJobClick = (jobId) => {
    router.push("/jobs/" + jobId);
  }
  
  const queryClient = useQueryClient();
  const showToast = useToast();

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      showToast("Job deleted successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
  });

  const jobs = data?.data || [];

  const handleDeleteJob = (jobId) => {
    deleteJobMutation.mutate(jobId);
  };

  return (
    <JobsTablePresentation
      jobs={jobs}
      isLoading={isLoading}
      isError={isError}
      handleDeleteJob={handleDeleteJob}
      page={page}
      setPage={setPage}
      isFetching={isFetching}
      data={data}
      handleJobClick={handleJobClick} 
      setQuery={setQuery}
    />
  );
}