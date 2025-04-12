import JobsCard from "./JobsCard";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobsExplorePresentation component displays job listings with loading, error, and pagination states.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isLoading - Indicates if the job listings are being loaded.
 * @param {Object} props.error - Error object if there was an error loading job listings.
 * @param {Object} props.data - Data object containing job listings.
 * @param {boolean} props.isFetchingNextPage - Indicates if the next page of job listings is being fetched.
 * @param {boolean} props.hasNextPage - Indicates if there are more pages of job listings to fetch.
 * @param {Function} props.fetchNextPage - Function to fetch the next page of job listings.
 * @param {Function} props.handleJobClick - Function to handle job click events.
 *
 * @returns {JSX.Element} The rendered component.
 */
const JobsExplorePresentation = ({
  isLoading,
  error,
  data,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  handleJobClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="ease-linear rounded-full border-4 border-t-4 border-gray-200 border-t-secondary h-12 w-12 animate-spin"></div>
        <span className="ml-4 text-text">Loading job listings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button
          onClick={() => fetchNextPage()}
          className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-text px-2">Explore</h2>
      <JobsCard jobListings={data || []} handleJobClick={handleJobClick} />

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="ease-linear rounded-full border-4 border-t-4  border-gray-200 border-t-secondary h-8 w-8 animate-spin"></div>
          <span className="ml-3 text-text text-sm">Loading more...</span>
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            className="px-4 py-2 rounded-md bg-secondary text-background hover:bg-secondary/80 transition-colors duration-200"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsExplorePresentation;
