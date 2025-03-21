"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobListingsPageNumber } from "@/app/services/jobs";
import { deleteJob } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";
import { JobsTablePresentation } from "../presentation/JobsTablePresentation";
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

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobsAdmin", page],
    queryFn: () => fetchJobListingsPageNumber({ pageParam: page }),
    keepPreviousData: true,
  });

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
    />
  );
}