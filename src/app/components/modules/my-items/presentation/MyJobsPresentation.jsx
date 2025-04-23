import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/Tabs";
import { Add as AddIcon, Download as DownloadIcon } from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/app/components/ui/HoverCard";

/**
 * @namespace my-items
 * @module my-items
 */
/**
 * MyJobsPresentation component displays a tabbed interface for managing job applications.
 * It allows users to filter jobs by their status and provides functionality to load more jobs.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.jobs - List of job objects to display.
 * @param {Function} props.formatDate - Function to format the job application date.
 * @param {Function} props.formatTime - Function to format the job application time.
 * @param {Function} props.getStatusColor - Function to get the color class for a job status.
 * @param {Function} props.onJobClick - Callback function triggered when a job is clicked.
 * @param {Function} props.onMoreJobsClick - Callback function triggered when the "Apply to Jobs" button is clicked.
 * @param {boolean} props.hasMoreJobs - Indicates if there are more jobs to load.
 * @param {Function} props.loadMoreJobs - Function to load more jobs.
 * @param {boolean} props.isLoadingMore - Indicates if more jobs are currently being loaded.
 * @param {string} props.errorMessage - Optional error message to display when some data failed to load.
 */
function MyJobsPresentation({
  jobs = [],
  formatDate,
  formatTime,
  getStatusColor,
  onJobClick,
  onMoreJobsClick,
  hasMoreJobs,
  loadMoreJobs,
  isLoadingMore,
  errorMessage,
  isLoading = false,
  isError = false,
  error = null,
}) {
  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64 bg-foreground rounded-xl shadow-lg">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">Loading saved jobs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-foreground rounded-xl text-center mx-auto">
      <ErrorOutlineIcon sx={{ fontSize: "3rem" }} className=" text-red-500 mx-auto mb-4" />
      <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">
        Unable to load saved jobs
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {error?.message || "Something went wrong. Please try again."}
      </p>
      <Button
        variant="default"
        onClick={handleRetry}
        className="bg-secondary text-background hover:bg-secondary/80 transition-colors duration-200"  >
        Try Again
      </Button>
      </div>
    );
  }
  // Filter jobs based on tab
  const filteredJobs = (tabValue) => {
    if (!Array.isArray(jobs) || jobs.length === 0) return [];
    if (tabValue === "all") return jobs;
    return jobs.filter((job) => job.status === tabValue);
  };

  // Count jobs in each category for tab badges
  const countByStatus = {
    all: jobs.length,
    accepted: filteredJobs("accepted").length,
    rejected: filteredJobs("rejected").length,
    pending: filteredJobs("pending").length,
  };

  return (
    <div className="p-4 rounded-2xl shadow-2xl bg-foreground px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">My Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your job applications
        </p>
      </div>

      {/* Show error message if needed */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          {errorMessage} Some job categories may be incomplete.
        </div>
      )}

      <Tabs defaultValue="all" className="w-full ">
        <div className="flex flex-col justify-between items-center mb-6 md:flex-row gap-4">
          <TabsList className="border-b order-last md:order-first bg-hover">
            <TabsTrigger
              value="all"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              All ({countByStatus.all})
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Accepted ({countByStatus.accepted})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Rejected ({countByStatus.rejected})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Pending ({countByStatus.pending})
            </TabsTrigger>
          </TabsList>
          <div className="flex space-x-2 order-first md:order-last">
            <button
              className="flex items-center px-4 py-2 bg-secondary text-background hover:bg-secondary/80 transition-colors duration-200 rounded-md "
              onClick={onMoreJobsClick}
            >
              <AddIcon className="h-4 w-4 mr-2" />
              Apply to Jobs
            </button>
          </div>
        </div>

        {/* All Applications Tab */}
        <TabsContent value="all" className="space-y-4 ">
          {filteredJobs("all").length > 0 ? (
            <>
              <JobsTable
                jobs={filteredJobs("all")}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusColor={getStatusColor}
                onJobClick={onJobClick}
              />
              {hasMoreJobs && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => loadMoreJobs()}
                    disabled={isLoadingMore}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
                  >
                    {isLoadingMore ? "Loading more..." : "Load more jobs"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No job applications yet
            </div>
          )}
        </TabsContent>

        {/* Accepted Tab */}
        <TabsContent value="accepted">
          {filteredJobs("accepted").length > 0 ? (
            <JobsTable
              jobs={filteredJobs("accepted")}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
              onJobClick={onJobClick}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No accepted job applications yet
            </div>
          )}
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected">
          {filteredJobs("rejected").length > 0 ? (
            <JobsTable
              jobs={filteredJobs("rejected")}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
              onJobClick={onJobClick}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No rejected job applications
            </div>
          )}
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending">
          {filteredJobs("pending").length > 0 ? (
            <JobsTable
              jobs={filteredJobs("pending")}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
              onJobClick={onJobClick}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pending job applications
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Extracted Jobs Table component for reuse across tabs
function JobsTable({
  jobs,
  formatDate,
  formatTime,
  getStatusColor,
  onJobClick,
}) {
  return (
    <div className="overflow-x-auto rounded-xl mb-2">
      <table className="min-w-full bg-background">
        <thead>
          <tr className="bg-hover text-left text-text">
            <th className="p-4 ">Job</th>
            <th className="p-4 ">Company</th>
            <th className="p-4 ">Date Applied</th>
            <th className="p-4 ">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs?.map((job, index) => (
            <tr
              key={`${job._id}-${index}`}
              className="border-b bg-foreground hover:bg-hover cursor-pointer"
              onClick={() => onJobClick(job)}
            >
              <td className="p-4">
                <div className="font-semibold text-text">{job.title}</div>
                <div className="text-sm text-gray-600">
                  {job.location} • {job.workLocation} • {job.employmentType}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center">
                  {job.companyData?.logo ? (
                    <img
                      src={job.companyData.logo}
                      alt={job.companyData.name || "Company Logo"}
                      className="w-10 h-10 mr-3 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 mr-3 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">N/A</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-300">
                      {job.companyData?.name || "Company Name"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {job.companyData?.location || "Location not available"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-gray-800 dark:text-gray-400">
                  {formatDate(job.appliedAt)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(job.appliedAt)}
                </div>
              </td>
              <td className="p-4">
                {/* Status badge with dynamic color based on status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status
                    ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
                    : "N/A"}
                </span>
              </td>
              <td className="p-4">
                <div className="flex space-x-2">{employerFeedback(job)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const employerFeedback = (job) => {
  if (job.notes) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            className="p-1 text-gray-600 hover:text-secondary transition-colors duration-200"
            title="View feedback"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the row click event
            }}
          >
            <FeedbackIcon sx={{ fontSize: "1.75rem" }} />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Employer Feedback</h4>
            <p className="text-sm text-gray-500">{job?.notes}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }
  return (
    <button
      className="p-1 text-gray-300 cursor-not-allowed disabled:dark:text-background/80"
      disabled
      title="No feedback available"
    >
      <FeedbackIcon sx={{ fontSize: "1.75rem" }} />
    </button>
  );
};
export default MyJobsPresentation;
