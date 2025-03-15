
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * JobActions component renders action buttons for a job listing.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.job - The job object containing job details.
 * @param {string} props.job.title - The title of the job.
 * @param {string} props.job.job_id - The unique identifier of the job.
 * 
 * @returns {JSX.Element} The rendered JobActions component.
 */

export default function JobActions({job}) {

  return (
    <div className="mt-8 flex space-x-4">
      <button className="flex items-center gap-2 px-6 py-2 bg-secondary text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700 transition duration-300" >
        <CheckCircleIcon className="h-5 w-5" />
        Apply Now
      </button>

      <button className="flex items-center gap-2 px-6 py-2 border border-secondary text-secondary text-sm font-medium rounded-md hover:bg-blue-100 transition duration-300" >
        <BookmarkIcon className="h-5 w-5 text-secondary" />
        Save Job
      </button>
    </div>
  );
}