import { Textarea } from "@/app/components/ui/Textarea";
import { Done, Error } from "@mui/icons-material";
import { useState } from "react";

export default function ReportPostPresentation({
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
  reportState,
  reportType,
  reportText,
  setReportText,
  setReportType
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      {/* Initial State: Show Report Form */}
      {(reportState === 0) && (
        <>
          <h2 className="text-xl font-bold mb-2 text-primary">Report Post</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Help us understand the problem. What's wrong with this post?
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6 w-full">
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
              >
                {option}
              </button>
            ))}
          </div>

          {/* Textarea for "Something Else" option */}
          {reportType === "Something Else" && (
            <div className="w-full mb-6">
              <label
                htmlFor="reportDetails"
                className="block text-sm font-medium text-primary mb-1"
              >
                Please provide more details:
              </label>
              <Textarea
                id="reportDetails"
                className="w-full h-28 p-3 rounded-md border border-primary bg-background focus:ring-2 focus-visible:ring-primary text-primary dark:focus:ring-primary/70 focus:border-transparent"
                placeholder="Explain why you are reporting this post..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
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
          >
            Submit Report
          </button>
        </>
      )}

      {/* Loading State */}
      {reportState === 1 && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="size-12 border-t-4 border-t-transparent border-4 border-secondary animate-spin rounded-full" />
          <p className="text-primary font-semibold text-lg mt-3 animate-pulse">
            Submitting Report...
          </p>
          <p className="text-muted text-sm">Please wait a moment.</p>
        </div>
      )}

      {/* Success State */}
      {reportState === 2 && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="bg-green-100 p-3 rounded-full">
            <Done className="text-green-600" sx={{ fontSize: "3rem" }} />
          </div>
          <h3 className="text-xl font-bold dark:text-green-500 text-green-700 mt-3">
            Report Submitted!
          </h3>
          <p className="text-muted">
            Thank you for helping keep our community safe. We'll review your
            report shortly.
          </p>
        </div>
      )}

      {/* Error State */}
      {reportState === 3 && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Error className="text-red-600" sx={{ fontSize: "3rem" }} />
          </div>
          <h3 className="text-xl font-bold text-destructive mt-3">
            Submission Failed
          </h3>
          <p className="text-muted">
            We couldn't submit your report. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
