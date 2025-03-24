import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/Tabs";
import {
  FilterList as FilterIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

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
}) {
  // Filter jobs based on tab
  const filteredJobs = (tabValue) => {
    if (tabValue === "all") return jobs;
    return jobs.filter(job => job.status === tabValue);
  };

  return (
    <div className=" p-4 rounded-2xl shadow-2xl bg-foreground px-8 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">My Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your job applications
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col justify-between items-center mb-6 md:flex-row gap-4">
          <TabsList className="border-b order-last md:order-first dark:bg-background">
            <TabsTrigger
              value="all"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              All Applications
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Accepted
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Rejected
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="px-4 py-2 text-black data-[state=active]:text-text dark:data-[state=active]:text-white dark:text-gray-500"
            >
              Pending
            </TabsTrigger>
          </TabsList>
          <div className="flex space-x-2 order-first md:order-last">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={onMoreJobsClick}>
              <AddIcon className="h-4 w-4 mr-2" />
              Apply to Jobs
            </button>
          </div>
        </div>

        {/* All Applications Tab */}
        <TabsContent value="all" className="space-y-4">
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
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved">
          {filteredJobs("saved").length > 0 ? (
            <JobsTable
              jobs={filteredJobs("saved")}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
              onJobClick={onJobClick}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              You haven't saved any jobs yet
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
function JobsTable({ jobs, formatDate, formatTime, getStatusColor, onJobClick }) {
  return (
    <div className="overflow-x-auto rounded-xl mb-2 ">
      <table className="min-w-full bg-background">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 text-gray-700">Job</th>
            <th className="p-4 text-gray-700">Company</th>
            <th className="p-4 text-gray-700">Date Applied</th>
            <th className="p-4 text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs?.map((job, index) => (
            <tr
              key={`${job._id}-${index}`}
              className="border-b hover:bg-foreground dark:hover:bg-gray-800 cursor-pointer"
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
                  {formatDate(job.createdAt)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(job.createdAt)}
                </div>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'N/A'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyJobsPresentation;