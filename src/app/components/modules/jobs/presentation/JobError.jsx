/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobError component displays an error message with an option to reload the page.
 * Pure presentation component for error states.
 *
 * @param {Object} props - The component props.
 * @param {string} props.errorMessage - The error message to display.
 * @param {Function} props.onRetry - Optional function to call when retry button is clicked.
 *
 * @returns {JSX.Element} The rendered JobError component.
 */
import { ErrorOutline } from "@mui/icons-material";

export default function JobError({ errorMessage, onRetry }) {
  const handleRetry = () => {
    if (typeof onRetry === 'function') {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex flex-col items-center dark:bg-foreground dark:text-red-200">
      <div className="flex items-center space-x-2">
        <ErrorOutline className="h-6 w-6 text-red-500" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Failed to load job details</h2>
      </div>
      <p className="mt-2">{errorMessage}</p>
      <button
        onClick={handleRetry}
        className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-300"
        aria-label="Try loading the job details again"
      >
        Try Again
      </button>
    </div>
  );
}