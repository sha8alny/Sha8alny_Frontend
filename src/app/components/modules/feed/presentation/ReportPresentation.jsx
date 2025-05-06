import { Textarea } from "@/app/components/ui/Textarea";
import { Done, Error } from "@mui/icons-material";

/**
 * ReportPresentation - Dialog content for reporting inappropriate content
 * 
 * This component provides a multi-step interface for reporting content:
 * - Selection of predefined report reasons
 * - Custom text input for detailed explanations
 * - Animated states for submission feedback (loading, success, error)
 * - Visual feedback to guide users through the reporting process
 * 
 * The component handles all states of the reporting flow from initial form
 * to submission confirmation.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.reportOptions - Array of predefined report reason options
 * @param {Function} props.onReport - Handler for submitting the report
 * @param {string} props.type - Type of content being reported (e.g., "post", "comment")
 * @param {number} props.reportState - Current state of reporting process (0: input, 1: loading, 2: success, 3: error)
 * @param {string|null} props.reportType - Selected reason for reporting
 * @param {string} props.reportText - Custom report text for "Something Else" option
 * @param {Function} props.setReportText - State setter for report text
 * @param {Function} props.setReportType - State setter for report reason
 * @returns {JSX.Element} Report dialog content with appropriate state display
 */
export default function ReportPresentation({
  reportOptions = [
    "Spam",
    "Harassment",
    "Hate Speech",
    "Nudity",
    "Violence",
    "Suicide or Self-Injury",
    "False News",
    "Unauthorized Sales",
    "Terrorism",
    "Something Else",
  ],
  onReport,
  type,
  reportState,
  reportType,
  reportText,
  setReportText,
  setReportType,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center p-6 max-w-md mx-auto"
      data-testid="report-root"
    >
      {/* Initial State: Show Report Form */}
      {reportState === 0 && (
        <>
          <h2
            className="text-xl font-bold mb-2 text-primary"
            data-testid="report-title"
          >
            Report {type[0].toUpperCase() + type.slice(1)}
          </h2>
          <p
            className="text-muted-foreground mb-6 text-center"
            data-testid="report-description"
          >
            Help us understand the problem. What's wrong with this {type}?
          </p>
          <div
            className="flex flex-wrap justify-center gap-3 mb-6 w-full"
            data-testid="report-options"
          >
            {reportOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setReportType(option)}
                className={`
                  px-3 py-1 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 ease-in-out
                  text-background shadow-md
                  ${
                    reportType === option
                      ? "bg-destructive ring-2 font-semibold ring-destructive ring-offset-2 ring-offset-background"
                      : "bg-secondary hover:bg-secondary/70"
                  }
                `}
                data-testid={`report-option-${option
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Textarea for "Something Else" option */}
          {reportType === "Something Else" && (
            <div className="w-full mb-6" data-testid="report-textarea-wrapper">
              <label
                htmlFor="reportDetails"
                className="block text-sm font-medium text-primary mb-1"
                data-testid="report-textarea-label"
              >
                Please provide more details:
              </label>
              <Textarea
                id="reportDetails"
                className="w-full h-28 p-3 rounded-md border border-primary bg-background focus:ring-2 focus-visible:ring-primary text-primary dark:focus:ring-primary/70 focus:border-transparent"
                placeholder={`Explain why you are reporting this ${type}...`}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                data-testid="report-textarea"
              />
            </div>
          )}

          <button
            onClick={onReport}
            disabled={
              !reportType ||
              (reportType === "Something Else" && !reportText.trim())
            }
            className="w-full cursor-pointer bg-primary text-background px-6 py-3 rounded-md font-semibold hover:bg-primary/80 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="report-submit-btn"
          >
            Submit Report
          </button>
        </>
      )}

      {/* Loading State */}
      {reportState === 1 && (
        <div
          className="flex flex-col items-center justify-center gap-4 py-10 text-center"
          data-testid="report-loading"
        >
          <div
            className="size-12 border-t-4 border-t-transparent border-4 border-secondary animate-spin rounded-full"
            data-testid="report-loading-spinner"
          />
          <p
            className="text-primary font-semibold text-lg mt-3 animate-pulse"
            data-testid="report-loading-text"
          >
            Submitting Report...
          </p>
          <p className="text-muted text-sm" data-testid="report-loading-desc">
            Please wait a moment.
          </p>
        </div>
      )}

      {/* Success State */}
      {reportState === 2 && (
        <div
          className="flex flex-col items-center justify-center gap-4 py-10 text-center"
          data-testid="report-success"
        >
          <div
            className="bg-green-100 p-3 rounded-full"
            data-testid="report-success-icon"
          >
            <Done className="text-green-600" sx={{ fontSize: "3rem" }} />
          </div>
          <h3
            className="text-xl font-bold dark:text-green-500 text-green-700 mt-3"
            data-testid="report-success-title"
          >
            Report Submitted!
          </h3>
          <p className="text-muted" data-testid="report-success-desc">
            Thank you for helping keep our community safe. We'll review your
            report shortly.
          </p>
        </div>
      )}

      {/* Error State */}
      {reportState === 3 && (
        <div
          className="flex flex-col items-center justify-center gap-4 py-10 text-center"
          data-testid="report-error"
        >
          <div
            className="bg-red-100 p-3 rounded-full"
            data-testid="report-error-icon"
          >
            <Error className="text-red-600" sx={{ fontSize: "3rem" }} />
          </div>
          <h3
            className="text-xl font-bold text-destructive mt-3"
            data-testid="report-error-title"
          >
            Submission Failed
          </h3>
          <p className="text-muted" data-testid="report-error-desc">
            We couldn't submit your report. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
