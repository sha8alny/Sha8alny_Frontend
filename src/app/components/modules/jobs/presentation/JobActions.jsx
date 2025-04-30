import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import JobApplicationModalContainer from "../container/JobApplicationModalContainer";
import Dialog from "@/app/components/ui/DialogMod";
import ReportPresentation from "../../feed/presentation/ReportPresentation";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobActions component renders action buttons for a job listing.
 * Pure presentation component that receives all data and handlers from container.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.job - The normalized job object containing job details.
 * @param {string} props.job.id - The unique identifier of the job.
 * @param {string} props.job.title - The title of the job.
 * @param {boolean} props.job.isAcceptingApplications - Whether the job is accepting applications.
 * @param {Function} props.onSaveJob - Function to handle saving/unsaving a job.
 * @param {boolean} props.isSaving - Whether a save operation is in progress.
 * @param {boolean} props.isSaved - Whether the job is saved by the user.
 * @param {boolean} props.modalOpen - Whether the application modal is open.
 * @param {Function} props.handleOpenModal - Function to open the application modal.
 * @param {Function} props.handleCloseModal - Function to close the application modal.
 * @param {boolean} props.reportModalOpen - Whether the report modal is open.
 * @param {Function} props.handleOpenReportModal - Function to open the report modal.
 * @param {Function} props.handleCloseReportModal - Function to handle report modal open state change.
 * @param {number} props.reportState - Current state of the report process.
 * @param {string} props.reportText - Text content of the report.
 * @param {Function} props.setReportText - Function to update report text.
 * @param {string} props.reportType - Type of report selected.
 * @param {Function} props.setReportType - Function to update report type.
 * @param {Function} props.onReport - Function to submit a report.
 *
 * @returns {JSX.Element} The rendered JobActions component.
 */
export default function JobActions({
  job,
  onSaveJob,
  isSaving = false,
  isSaved,
  modalOpen,
  handleOpenModal,
  handleCloseModal,
  reportModalOpen,
  handleOpenReportModal,
  handleCloseReportModal,
  reportState,
  reportText,
  setReportText,
  reportType,
  setReportType,
  onReport
}) {
  return (
    <div
      className="mt-8 flex flex-wrap items-center space-x-4"
      data-id="job-actions-container"
    >
      {/* Primary Action Buttons (Left-aligned) */}
      <div className="flex space-x-4 flex-1">
        <button
          onClick={handleOpenModal}
          className={`flex items-center gap-2 px-6 py-2 text-white dark:text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 text-sm font-medium rounded-md shadow-md ${
            !job.isAcceptingApplications ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Apply for this job"
          data-testid="apply-job-button"
          disabled={!job.isAcceptingApplications}
          title={
            !job.isAcceptingApplications
              ? "This job is not accepting applications at this time"
              : "Apply for this position"
          }
        >
          <CheckCircleIcon className="h-5 w-5" />
          {job.isAcceptingApplications
            ? "Apply Now"
            : "Not Accepting Applications"}
        </button>

        <button
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition duration-300 ${
            isSaved
              ? "text-white dark:text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
              : "border border-secondary text-secondary hover:bg-secondary/10"
          } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onSaveJob}
          disabled={isSaving}
          aria-label={isSaved ? "Unsave this job" : "Save this job"}
          title={
            isSaving
              ? "Please wait while we process your request"
              : isSaved
              ? "Remove from saved jobs"
              : "Add to saved jobs"
          }
          data-testid="save-job-button"
        >
          <BookmarkIcon
            className={`h-5 w-5 ${
              isSaved ? "text-background" : "text-secondary"
            }`}
          />
          {isSaving ? "Loading..." : isSaved ? "Saved" : "Save Job"}
        </button>
      </div>

      {/* Report Button (Right-aligned, text link style) */}
      <button
        className="text-gray-500 hover:text-destructive text-sm font-medium hover:underline transition-colors duration-200 ml-auto"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Report button clicked");
          handleOpenReportModal();
        }}
        aria-label="Report this job"
        title="Report this job"
        data-testid="report-job-button"
      >
        <span className="flex items-center">
          <FlagIcon className="h-4 w-4 mr-1" />
          Report
        </span>
      </button>

      {modalOpen && (
        <JobApplicationModalContainer
          show={modalOpen}
          handleClose={handleCloseModal}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}

      {/* Report Dialog */}
      <Dialog
        open={reportModalOpen}
        onOpenChange={handleCloseReportModal}
        buttonClass="hidden"
        className="min-w-max"
        AlertContent={
          <ReportPresentation
            type={"job"}
            reportState={reportState}
            reportText={reportText}
            setReportText={setReportText}
            reportType={reportType}
            setReportType={setReportType}
            onReport={onReport}
          />
        }
      />
    </div>
  );
}
