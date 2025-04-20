"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InappropriateContentReportsPresentation } from "../presentation/InappropriateContentReportPresentation";
import { fetchReports, deleteReport, deleteUser, deletePost, deleteComment, updateStatusReport } from "@/app/services/admin";
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

export function InappropriateContentReportsContainer() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState([]);
  const statusOptions = ["Pending", "Reviewing", "Approved", "Rejected"];
  const queryClient = useQueryClient();
  const showToast = useToast();
  
  const { data:reports, isLoading, isError, isFetching } = useQuery({
    queryKey: ["inappropriateContentReports", page, sortOrder,selectedStatuses],
    queryFn: () =>
      fetchReports({ pageParam: page , users:true, comments:true, posts:true, statuses:selectedStatuses, sortByTime:sortOrder, TypeFilter:filters}),
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
  
  const updateReportMutation = useMutation({
    mutationFn: updateStatusReport,
    onSuccess: () => {
      showToast("Report status updated successfully");
      queryClient.invalidateQueries(["inappropriateContentReports"]);
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

  const handleUpdateReport = (reportId, status) => {
    updateReportMutation.mutate({ reportId, status });
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };
  const handleFilterChange = (value) => {
    setFilters((prevFilters)=>{
    if(prevFilters.includes(value)){
      return prevFilters.filter((filter) => filter !== value);
    } 
    if((prevFilters.includes("users")|| prevFilters.includes("posts") || prevFilters.includes("comments") )&& value === "all"){
      return [prevFilters.filter((filter) => filter !== "users" && filter !== "posts" && filter !== "comments"), value];
      
    }
    if((prevFilters.includes("all"))&& (value === "users" || value === "posts" || value === "comments")){
      return [prevFilters.filter((filter) => filter !== "all"), value];
    }
    return [...prevFilters, value];
    });
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
    <InappropriateContentReportsPresentation
    reports={reports?.data ? reports: []}
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
  
    />
  );
}
