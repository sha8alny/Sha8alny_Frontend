"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FlaggedJobsTablePresentation } from "../presentation/FlaggedJobsTablePresentation";
import { fetchReports, deleteReport, deleteJob, updateStatusReport, reactivateContent } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace admin
 * @module admin
 */
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
  const [sortOrder, setSortOrder] = useState("asc");
  const statusOptions = ["pending", "resolved", "rejected"];
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(null);

  const { data: reports, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobReports", page, sortOrder, selectedStatuses],
    queryFn: () =>
      fetchReports({
        pageParam: page,
        pageSize: 10,
        type: ["Job"],
        status: selectedStatuses,
        sortByTime: sortOrder
      }),
    keepPreviousData: true,
    retry: false,
  });

  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      showToast("Report disapproved successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error disapproving report: ${errorMessage}`, "error");
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      showToast("Job deleted successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error deleting job: ${errorMessage}`, "error");
    }
  });

  const reactivateJobMutation = useMutation({
    mutationFn: reactivateContent,
    onSuccess: () => {
      showToast("Job reactivated successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error reactivating job: ${errorMessage}`, "error");
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: updateStatusReport,
    onSuccess: () => {
      showToast("Report status updated successfully");
      queryClient.invalidateQueries(["jobReports"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Error updating report: ${errorMessage}`, "error");
    }
  });

  const handleViewDetails = (report) => {
    const reportWithDetails = {
      _id: report.reportData._id,
      title: report.itemDetails.title,
      location: report.itemDetails.location,
      employmentType: report.itemDetails.employmentType,
      companyData: report.itemDetails.companyData,
      accountName: report.reportData.userId,
      createdAt: report.reportData.createdAt,
      status: report.reportData.status,
      reason: report.reportData.reason,
      jobId: report.reportData.jobId,
      text: report.reportData.text || report.reportData.reason,
      reportData: report.reportData,
      itemDetails: report.itemDetails
    };

    setSelectedReport(reportWithDetails);
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

  const handleReactivateJob = (jobId) => {
    reactivateJobMutation.mutate({ type: "Job", id: jobId });
  };

  const handleUpdateReport = (reportId, status) => {
    updateReportMutation.mutate({ reportId, status });
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleStatusFilter = (status) => {
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
      case "resolved":
        return "text-green-600 border-green-600";
      case "rejected":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <FlaggedJobsTablePresentation
      reports={reports || { data: [] }}
      isDialogOpen={isDialogOpen}
      selectedReport={selectedReport}
      handleViewDetails={handleViewDetails}
      handleCloseDialog={handleCloseDialog}
      handleDeleteReport={handleDeleteReport}
      handleDeleteJob={handleDeleteJob}
      handleUpdateReport={handleUpdateReport}
      handleReactivateJob={handleReactivateJob}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      page={page}
      setPage={setPage}
      statusOptions={statusOptions}
      toggleStatusFilter={toggleStatusFilter}
      handleStatusFilter={toggleStatusFilter}
      selectedStatuses={selectedStatuses}
      getStatusColor={getStatusColor}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      openConfirmationDialog={openConfirmationDialog}
      setOpenConfirmationDialog={setOpenConfirmationDialog}
    />
  );
}