import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import JobApplicationModalContainer from "../container/JobApplicationModalContainer";

/**
 * JobActions component renders action buttons for a job listing.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.job - The normalized job object containing job details.
 * @param {string} props.job.id - The unique identifier of the job.
 * @param {string} props.job.title - The title of the job.
 * @param {boolean} props.job.isSavedByUser - Whether the job is saved by the user.
 *
 * @returns {JSX.Element} The rendered JobActions component.
 */

export default function JobActions({ job }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="mt-8 flex space-x-4">
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-secondary transition duration-300"
      >
        <CheckCircleIcon className="h-5 w-5" />
        Apply Now
      </button>

      <JobApplicationModalContainer
        show={modalOpen}
        handleClose={handleCloseModal}
        jobId={job.id}
        jobTitle={job.title}
      />

      <button
        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition duration-300 ${
          job.isSavedByUser
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-secondary text-secondary hover:bg-blue-100"
        }`}
      >
        <BookmarkIcon
          className={`h-5 w-5 ${
            job.isSavedByUser ? "text-white" : "text-secondary"
          }`}
        />
        {job.isSavedByUser ? "Saved" : "Save Job"}
      </button>
    </div>
  );
}
