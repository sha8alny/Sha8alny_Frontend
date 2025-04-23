import React from "react";
import JobsCard from "../../jobs/presentation/JobsCard";
import { Button } from "@/app/components/ui/Button";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * @namespace my-items
 * @module my-items
 */
/**
 * Component for displaying saved jobs with options to browse more jobs or load additional saved jobs.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Array} [props.savedJobs=[]] - Array of saved job objects to display.
 * @param {Object|null} [props.error=null] - Error object if there is an error loading saved jobs.
 * @param {boolean} [props.isLoading=false] - Flag indicating if the saved jobs are currently being loaded.
 * @param {Function} props.fetchNextPage - Function to fetch the next page of saved jobs.
 * @param {boolean} [props.hasNextPage=false] - Flag indicating if there are more pages of saved jobs to load.
 * @param {boolean} [props.isFetchingNextPage=false] - Flag indicating if the next page of saved jobs is currently being fetched.
 * @param {Function} props.handleJobClick - Function to handle clicking on a job card.
 * @param {Function} props.handleMoreJobsClick - Function to handle clicking the "Browse More Jobs" button.
 *
 * @returns {JSX.Element} The rendered SavedJobsPresentation component.
 */
function SavedJobsPresentation({
  savedJobs = [],
  error = null,
  isLoading = false,
  isError = false,
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage = false,
  handleJobClick,
  handleMoreJobsClick,
  handleRetry,
}) {
  // Use savedJobs directly since it's already normalized in the container
  const jobs = savedJobs.length > 0 ? savedJobs : [];
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
  return (
    <div className="p-4 rounded-2xl shadow-2xl bg-foreground px-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Saved Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Jobs you've saved for later
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-secondary text-background hover:bg-secondary/80 transition-colors duration-20 rounded-md " onClick={handleMoreJobsClick}>
            Browse More Jobs
          </button>
        </div>
      </div>

      { jobs.length > 0 ? (
        <>
          <JobsCard jobListings={jobs} handleJobClick={handleJobClick} />

          {hasNextPage && (
            <div className="mt-4 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 disabled:bg-blue-400 transition-colors duration-200"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More Jobs"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-background rounded-xl p-6 text-center">
          <div className="text-gray-500 mb-4">
            You haven't saved any jobs yet
          </div>
          <p className="text-gray-600 mb-4">
            Save jobs you're interested in to keep track of opportunities that
            catch your eye
          </p>
          <button className="px-4 py-2 bg-secondary text-background rounded-md hover:bg-secondary/80 transition-colors duration-200" onClick={handleMoreJobsClick}>
            Explore Jobs
          </button>
        </div>
      )}
    </div>
  );
}

export default SavedJobsPresentation;
