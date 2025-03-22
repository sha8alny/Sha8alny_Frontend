"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FlaggedJobsTablePresentation } from "../presentation/FlaggedJobsTablePresentation";
import { fetchReports, deleteReport, deleteJob, updateStatusReport } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";

/**
 * FlaggedJobsTableContainer component handles the logic for displaying and managing flagged job reports.
 * It fetches the reports, handles deletion of reports and jobs, and manages the state for viewing report details.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */

export function FlaggedJobsTableContainer() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const showToast = useToast();

  const { data:reports, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobReports", page],
    queryFn: () =>
      fetchReports({ reportType: "job", pageParam: page }),
    keepPreviousData: true,
  });

  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      showToast("Report disapproved successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      showToast("Job deleted successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
  });
  
  const updateReportMutation = useMutation({
    mutationFn: updateStatusReport,
    onSuccess: () => {
      showToast("Report status updated successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
  });



if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error loading reports.</div>;
if (!reports?.data || reports.data.length === 0) return <div>No reports found.</div>;


  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteReport = (reportId) => {
    deleteReportMutation.mutate(reportId);
  };

  const handleDeleteJob = (jobId) => {
    deleteJobMutation.mutate(jobId);
  };
  const handleUpdateReport = (reportId, status) => {
    updateReportMutation.mutate({ reportId, status });
  };
  return (
    <FlaggedJobsTablePresentation
      reports={reports}
      isDialogOpen={isDialogOpen}
      selectedReport={selectedReport}
      handleViewDetails={handleViewDetails}
      handleCloseDialog={handleCloseDialog}
      handleDeleteReport={handleDeleteReport}
      handleDeleteJob={handleDeleteJob}
      handleUpdateReport={handleUpdateReport}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      page={page}
      setPage={setPage}

    />
  );
}
