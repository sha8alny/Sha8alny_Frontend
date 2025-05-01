"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InappropriateContentReportsPresentation } from "../presentation/InappropriateContentReportPresentation";
import { fetchReports, deleteReport, deleteUser, deletePost, deleteComment, deleteCompany, updateStatusReport, reactivateContent } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";
import { useEffect } from "react";
import { data } from "autoprefixer";

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

export function InappropriateContentReportsContainer() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState(["User", "Comment", "Post", "Company"]);
  const allFilter = ["User", "Comment", "Post", "Company"];
  const statusOptions = ["Pending", "Resolved", "Rejected"];
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(null);

  useEffect(() => {
    if (selectedReport) {
      console.log("Selected Report ID:", selectedReport.itemDetails._id);
    }
  }, [selectedReport]);
  
  const { data: reports, isLoading, isError, isFetching } = useQuery({
    queryKey: ["inappropriateContentReports", page, sortOrder, selectedStatuses, filters],
    queryFn: () =>
      fetchReports({
        pageParam: page,
        sortByTime: sortOrder,
        status: selectedStatuses,
        type: filters, 
      }),
    keepPreviousData: true,
  });
  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      showToast("Report disapproved successfully");
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });
  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });
  
  const updateReportMutation = useMutation({
    mutationFn: updateStatusReport,
    onSuccess: () => {
      showToast("Report status updated successfully");
      queryClient.invalidateQueries(["inappropriateContentReports"]);
      setOpenConfirmationDialog(null);
    },
  });

  const reactivateContentMutation = useMutation({
    mutationFn: reactivateContent,
    onSuccess: (data, variables) => {
      const { type } = variables;
      if (type === "User") {
        showToast("User Unbanned successfully");
      } else if (type === "Company") {
        showToast("Company Reactivated successfully");
      } else if (type === "Post") {
        showToast("Post Restored successfully");
      } else if (type === "Comment") {
        showToast("Comment Restored successfully");
      }
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
    onError: (error) => {
      showToast("Error reactivating content", false);
    },
  });

 

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

  const handleDeleteUser = (userId) => {
    deleteUserMutation.mutate(userId);
  };
  const handleDeletePost = (postId) => {
    deletePostMutation.mutate(postId);
  };
  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };
  const handleDeleteCompany = (companyId) => {
    deleteCompanyMutation.mutate(companyId);
  };

  const handleUpdateReport = (reportId, status) => {
    updateReportMutation.mutate({ reportId, status });
  };
  const handleReactivateContent = (type, id) => {
    reactivateContentMutation.mutate({ type, id });
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };
  const handleFilterChange = (value) => {
      setFilters((prevFilters) => {
        if (value === "all") {
          return [...allFilter];
        }
    
        const isAllSelected = allFilter.every((f) => prevFilters.includes(f));
        if (isAllSelected && allFilter.includes(value)) {
          return [value]; 
        }
        let updatedFilters 
        if (prevFilters.includes(value)) {
           updatedFilters = prevFilters.filter((filter) => filter !== value);
          if (updatedFilters.length === 0) {
            return [...allFilter];
          }
        } else {
          updatedFilters = [...prevFilters, value];
        }
        return updatedFilters;
      });
    };


  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 border border-yellow-600";
      case "resolved":
        return "text-green-600 border-green-600";
      case "rejected":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <InappropriateContentReportsPresentation
    reports={reports ? reports: []}
    filters={filters}
    handleFilterChange={handleFilterChange}
    isDialogOpen={isDialogOpen}
      selectedReport={selectedReport}
      handleViewDetails={handleViewDetails}
      handleCloseDialog={handleCloseDialog}
      handleDeleteReport={handleDeleteReport}
      handleDeleteUser={handleDeleteUser}
      handleDeletePost={handleDeletePost}
      handleDeleteComment={handleDeleteComment}
      handleUpdateReport={handleUpdateReport}
      handleDeleteCompany={handleDeleteCompany}
      handleReactivateContent={handleReactivateContent}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
      page={page}
      setPage={setPage}
      statusOptions={statusOptions}
      toggleStatusFilter={toggleStatusFilter}
      selectedStatuses={selectedStatuses}
      getStatusColor={getStatusColor}
      sortOrder={sortOrder} 
      setSortOrder={setSortOrder}
      openConfirmationDialog={openConfirmationDialog}
      setOpenConfirmationDialog={setOpenConfirmationDialog}
      toast={showToast}
  
    />
  );
}
