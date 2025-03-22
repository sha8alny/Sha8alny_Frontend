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
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // New state for sort order
  const statusOptions = ["Pending", "Reviewing", "Approved", "Rejected"];
  const queryClient = useQueryClient();
  const showToast = useToast();
  
  const { data:reports, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobReports", page, sortOrder,selectedStatuses], // Include sortOrder in queryKey
    queryFn: () =>
      fetchReports({ pageParam: page , jobs:true,statuses:selectedStatuses, sortByTime:sortOrder }), // Pass sortOrder to fetchReports
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

 
  // if (!reports?.data || reports.data.length === 0) return <div>No reports found.</div>;

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

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };
 
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 border border-yellow-600";
      case "reviewing":
        return "text-blue-400 border-blue-400";
      case "approved":
        return "text-green-600 border-green-600";
      case "rejected":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <FlaggedJobsTablePresentation
    reports={reports?.data ? reports: []}  // Ensure it's always an array
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
      statusOptions={statusOptions}
      toggleStatusFilter={toggleStatusFilter}
      selectedStatuses={selectedStatuses}
      getStatusColor={getStatusColor}
      sortOrder={sortOrder} // Pass sortOrder to presentation component
      setSortOrder={setSortOrder} // Pass setSortOrder to presentation component
  
    />
  );
}
