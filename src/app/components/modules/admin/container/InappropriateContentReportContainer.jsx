"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InappropriateContentReportsPresentation } from "../presentation/InappropriateContentReportPresentation";
import { fetchReports, deleteReport, deleteUser, deletePost, deleteComment, deleteCompany, updateStatusReport, reactivateContent } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";
import { useEffect } from "react";
import { data } from "autoprefixer";

/**
 * Container component for managing inappropriate content reports.
 * Handles state management, API calls, and passes data to the presentation component.
 *
 * @namespace admin
 * @module admin
 * @component
 */

export function InappropriateContentReportsContainer() {
  /**
   * State for the currently selected report.
   * @type {Object|null}
   */
  const [selectedReport, setSelectedReport] = useState(null);

  /**
   * State for controlling the dialog visibility.
   * @type {boolean}
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    /**
   * Current page number for pagination.
   * @type {number}
   */
  const [page, setPage] = useState(1);
    /**
   * List of selected statuses for filtering reports.
   * @type {string[]}
   */
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  /**
   * Sort order for the reports (e.g., "asc" or "desc").
   * @type {string}
   */

  const [sortOrder, setSortOrder] = useState("asc");

  /**
   * List of filters for report types (e.g., "User", "Comment", "Post", "Company").
   * @type {string[]}
   */

  const [filters, setFilters] = useState(["User", "Comment", "Post", "Company"]);

  /**
   * All available filter options.
   * @type {string[]}
   */

  const allFilter = ["User", "Comment", "Post", "Company"];

    /**
   * Status options for filtering reports.
   * @type {string[]}
   */

  const statusOptions = ["Pending", "Resolved", "Rejected"];
  /**
   * React Query's query client for managing cache and queries.
   * @type {QueryClient}
   */
  const queryClient = useQueryClient();

  /**
   * Toast function for displaying notifications.
   * @type {Function}
   */
  const showToast = useToast();

  /**
   * State for controlling the confirmation dialog visibility.
   * @type {Object|null}
   */
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(null);

  /**
   * Effect to log the selected report's ID whenever it changes.
   */
  
  useEffect(() => {
    if (selectedReport) {
      console.log("Selected Report ID:", selectedReport.itemDetails._id);
    }
  }, [selectedReport]);

    /**
   * Fetches inappropriate content reports using React Query.
   * @type {Object}
   * @property {Array} data - The list of reports fetched from the server.
   * @property {boolean} isLoading - Indicates if the reports are currently being loaded.
   * @property {boolean} isError - Indicates if there was an error fetching the reports.
   * @property {boolean} isFetching - Indicates if the reports are being fetched in the background.
   */
  
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

  /**
   * Mutation for deleting a report.
   * Calls the `deleteReport` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      showToast("Report disapproved successfully");
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

  /**
   * Mutation for deleting a user.
   * Calls the `deleteUser` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

  /**
   * Mutation for deleting a post.
   * Calls the `deletePost` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

  /**
   * Mutation for deleting a comment.
   * Calls the `deleteComment` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

    /**
   * Mutation for deleting a company.
   * Calls the `deleteCompany` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(["inappropriateContentReports"]);
    },
  });

    /**
   * Mutation for updating the status of a report.
   * Calls the `updateStatusReport` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */
  
  const updateReportMutation = useMutation({
    mutationFn: updateStatusReport,
    onSuccess: () => {
      showToast("Report status updated successfully");
      queryClient.invalidateQueries(["inappropriateContentReports"]);
      setOpenConfirmationDialog(null);
    },
  });

  /**
   * Mutation for reactivating content.
   * Calls the `reactivateContent` function and invalidates the query cache on success.
   * @type {Object}
   * @property {Function} mutate - Function to trigger the mutation.
   */

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
