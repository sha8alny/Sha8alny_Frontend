import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Alert, AlertDescription } from "@/app/components/ui/Alert";
import { Label } from "@/app/components/ui/Label";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobApplicationModalPresenter is a React component that renders a modal for job applications.
 * It includes a form for users to input their details, upload a resume, and submit their application.
 *
 * @param {Object} props - The props object.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {Function} props.handleClose - Function to close the modal.
 * @param {string} props.jobTitle - The title of the job being applied for.
 * @param {Function} props.register - Function from react-hook-form to register form fields.
 * @param {Function} props.handleSubmit - Function from react-hook-form to handle form submission.
 * @param {Object} props.errors - Object containing validation errors for form fields.
 * @param {File|null} props.resume - The uploaded resume file.
 * @param {Function} props.handleFileChange - Function to handle file input changes.
 * @param {boolean} props.isSubmitting - Indicates whether the form is currently being submitted.
 * @param {boolean} props.success - Indicates whether the application was submitted successfully.
 * @param {string|null} props.error - Error message to display if the application submission fails.
 * @param {React.RefObject} props.fileInputRef - Reference to the file input element.
 *
 * @returns {JSX.Element} The rendered JobApplicationModalPresenter component.
 */
const JobApplicationModalPresenter = ({
  show,
  handleClose,
  jobTitle,
  register,
  handleSubmit,
  errors,
  resume,
  handleFileChange,
  isSubmitting,
  success,
  error,
  fileInputRef,
}) => {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg w-full bg-white dark:bg-background text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Apply for {jobTitle}
          </DialogTitle>
        </DialogHeader>

        {success && (
          <Alert className="mb-4 bg-green-100 text-green-800 border border-green-300 rounded-md animate-fade-in">
            <AlertDescription className="flex items-center gap-2">
              <CheckCircleIcon fontSize="small" />
              Your application has been submitted successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 bg-red-100 text-red-800 border border-red-300 rounded-md animate-fade-in">
            <AlertDescription className="flex items-center gap-2">
              <ErrorIcon fontSize="small" />
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 w-full"
          role="form"
        >
          <div className="space-y-2 w-full">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
              {...register("phone")}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label
              htmlFor="coverLetter"
              className="text-gray-700 dark:text-gray-300"
            >
              Cover Letter
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're a good fit for this position"
              className="min-h-[120px] w-full break-words resize-none max-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              {...register("coverLetter")}
            />
          </div>

          <div className="space-y-2 w-full">
            <Label
              htmlFor="resume-upload"
              className="text-gray-700 dark:text-gray-300"
            >
              Resume/CV
            </Label>
            <div className="flex flex-col gap-2">
              <div>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FileUploadIcon className="h-4 w-4" />
                  Upload Resume *
                </Button>
              </div>

              {resume?.name ? (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {resume.name}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No file selected
                </p>
              )}

              {errors.resume && (
                <p className="text-sm text-red-500">{errors.resume.message}</p>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="gap-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CancelIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-secondary hover:bg-secondary/80  text-background transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <AutorenewIcon className="h-4 -w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModalPresenter;
