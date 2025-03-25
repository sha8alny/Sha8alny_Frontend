import React from "react";
import JobsCard from "../../jobs/presentation/JobsCard";

function SavedJobsPresentation({
  savedJobs = [],
  error = null,
  isLoading = false,
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage = false,
  handleJobClick,
  handleMoreJobsClick,
}) {
  // Use savedJobs directly since it's already normalized in the container
  const jobs = savedJobs.length > 0 ? savedJobs : [];

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
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleMoreJobsClick}>
            Browse More Jobs
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-6">
          <p className="text-gray-600">Loading saved jobs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          <p>Error loading saved jobs: {error.message}</p>
        </div>
      ) : jobs.length > 0 ? (
        <>
          <JobsCard jobListings={jobs} handleJobClick={handleJobClick} />

          {hasNextPage && (
            <div className="mt-4 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleMoreJobsClick}>
            Explore Jobs
          </button>
        </div>
      )}
    </div>
  );
}

export default SavedJobsPresentation;
