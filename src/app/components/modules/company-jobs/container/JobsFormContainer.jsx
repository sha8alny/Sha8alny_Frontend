"use client";
import React, { useState, useEffect, useCallback } from "react";
import JobsForm from "../presentation/JobsForm";
import PostNewJobContainer from "./PostNewJobContainer";
import JobApplicantsPageContainer from "./JobApplicantsPageContainer";
import {
  postedJobs,
  deleteJob,
  editJob,
  deletedJobs,
  restoreJob
} from "../../../../services/companyManagement";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * JobsFormContainer component
 *
 * This component is responsible for fetching and displaying the list of posted jobs.
 * It handles the state management and data fetching logic.
 *
 * @component
 * @example
 * return (
 *   <JobsFormContainer />
 * )
 */
const JobsFormContainer = ({ username }) => {
  const [page, setPage] = useState(1);
  const [deletedJobsPage, setDeletedJobsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreDeletedJobs, setHasMoreDeletedJobs] = useState(true);
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [showJobApplicants, setShowJobApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [updatedJob, setUpdatedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialogForJobId, setOpenDialogForJobId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialogForId, setOpenDeleteDialogForId] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showDeletedJobs, setShowDeletedJobs] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["companyJobs", page, username],
    queryFn: ({ queryKey }) =>
      postedJobs({ page: queryKey[1], companyUsername: queryKey[2] }),
  });

  useEffect(() => {
    const checkHasMore = async () => {
      if (jobs && jobs.length === 5) {
        try {
          const nextData = await postedJobs({
            page: page + 1,
            companyUsername: username,
          });
          if (nextData && nextData.length > 0) {
            setHasMore(true);
          }
        } catch (error) {
          console.error("Error fetching next page of jobs:", error);
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    };
    checkHasMore();
  }, [jobs, page, username]); 


  const handleDeleteJob = async (jobId, username) => {
    setIsDeleting(true);
    try {
      const response = await deleteJob({ companyUsername: username, jobId });
      if (response) {
        toast("Job deleted successfully!");
        queryClient.invalidateQueries(["companyJobs", page, username]);
        queryClient.invalidateQueries(["deletedCompanyJobs", deletedJobsPage, username]);
        setIsDeleting(false);
        setTimeout(() => {
          setOpenDeleteDialogForId(null);
        }, 5000);
      } else {
        toast("Error deleting job", false);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast("Error deleting job", false);
    }
  };

  const {
    data: jobsDeleted = [],
    isDeletedLoading,
    isDeletedError,
  } = useQuery({
    queryKey: ["deletedCompanyJobs", deletedJobsPage, username],
    queryFn: ({ queryKey }) =>
      deletedJobs({ page: queryKey[1], companyUsername: queryKey[2] }),
  });

  useEffect(() => {
    const checkDeletedJobsHasMore = async () => {
      if (jobsDeleted && jobsDeleted.length === 5) {
        try {
          const nextData = await deletedJobs({
            page: deletedJobsPage + 1,
            companyUsername: username,
          });
          if (nextData && nextData.length > 0) {
            setHasMoreDeletedJobs(true);}
        } catch (error) {
          console.error("Error fetching next page of deleted jobs:", error);
          setHasMoreDeletedJobs(false);
        }
      } else {
        setHasMoreDeletedJobs(false);
      }
    };
    checkDeletedJobsHasMore();
  }, [jobsDeleted, deletedJobsPage, username]);

  const handleEditJob = async (jobId, username) => {
    if (!updatedJob) {
      toast("No job data to update", false);
      return;
    }
    setIsEditing(true);
    try {
      const response = await editJob({
        companyUsername: username,
        jobId,
        jobData: updatedJob,
      });
      if (response) {
        if (updatedJob.salary && isNaN(updatedJob.salary)) {
          toast("Salary must be a numeric value", false);
          return;
        }
        toast("Job updated successfully!");
        queryClient.invalidateQueries(["companyJobs", page, username]);
        setIsEditing(false);
        setTimeout(() => {
        setOpenDialogForJobId(null);
        setUpdatedJob(null);
        }
        , 500);
      } else {
        toast("Error updating job", false);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast("Error updating job", false);
    }
  };

  const handleRestoreJob = async (jobId, username) => {
    setIsRestoring(true);
    try {
      const response = await restoreJob({ companyUsername: username, jobId });
      if (response) {
        toast("Job restored successfully!");
        queryClient.invalidateQueries(["deletedCompanyJobs", deletedJobsPage, username]);
        queryClient.invalidateQueries(["companyJobs", page, username]);
        setIsRestoring(false);
        setTimeout(() => {
          setOpenDeleteDialogForId(null);
        }, 5000);
        setShowDeletedJobs(false);
      } else {
        toast("Error restoring job", false);
      }
    } catch (error) {
      console.error("Error restoring job:", error);
      toast("Error restoring job", false);
    }
  };

  const nextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const nextDeletedJobsPage = () => {
    if (hasMoreDeletedJobs) {
      setDeletedJobsPage((prev) => prev + 1);
    }
  }
  const prevDeletedJobsPage = () => {
    setDeletedJobsPage((prev) => Math.max(prev - 1, 1));
  };
  
  const showedJobs= showDeletedJobs? jobsDeleted : jobs 
  const hasMoreJobs= showDeletedJobs? hasMoreDeletedJobs: hasMore
  const nextJobPage = showDeletedJobs? nextDeletedJobsPage: nextPage
  const prevJobPage = showDeletedJobs? prevDeletedJobsPage: prevPage
  const jobsPage = showDeletedJobs? deletedJobsPage : page
  const isJobLoading = showDeletedJobs? isDeletedLoading: isLoading
  const isJobError = showDeletedJobs? isDeletedError: isError

  return (
    <div className="flex">
      {showPostJobForm ? (
        <PostNewJobContainer
          onBack={() => {
            queryClient.invalidateQueries(["companyJobs", page, username]);
            setShowDeletedJobs(false);
            setShowPostJobForm(false);
          }}
          username={username}
          initialJobData={null}
        />
      ) : showJobApplicants && selectedJob ? (
        <JobApplicantsPageContainer
          jobId={selectedJob}
          onBack={() => setShowJobApplicants(false)}
          username={username}
        />
      ) : (
        <>
          <JobsForm
            jobs={showedJobs || []}
            isLoading={isJobLoading}
            onShowPostJobForm={() => setShowPostJobForm(true)}
            onShowApplicants={(jobId) => {
              console.log("selected job", jobId);
              setSelectedJob(jobId);
              setShowJobApplicants(true);
            }}
            page={jobsPage}
            onNextPage={nextJobPage}
            onPrevPage={prevJobPage}
            hasMore={hasMoreJobs}
            onDeleteJob={(jobId) => handleDeleteJob(jobId, username)}
            setUpdatedJob={setUpdatedJob}
            onEditJob={(jobId) => handleEditJob(jobId, username)}
            isEditing={isEditing}
            openDialogForJobId={openDialogForJobId}
            setOpenDialogForJobId={setOpenDialogForJobId}
            isDeleting={isDeleting}
            openDeleteDialogForId={openDeleteDialogForId}
            setOpenDeleteDialogForId={setOpenDeleteDialogForId}
            isError={isJobError}
            onShowDeletedJobs={(value)=>setShowDeletedJobs(value)}
            showDeletedJobs={showDeletedJobs}
            onRestoreJob={(jobId) => handleRestoreJob(jobId, username)}
            isRestoring={isRestoring}
          />
        </>
      )}
    </div>
  );
};

export default JobsFormContainer;
