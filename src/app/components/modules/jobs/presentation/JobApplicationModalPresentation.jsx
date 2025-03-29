import React from "react";
import {
  Modal,
  Fade,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close, CloudUpload, Send, Cancel } from "@mui/icons-material";
import { useTheme } from "@/app/context/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // Consistent Material UI styling for dark/light mode
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.23)"
          : "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(0, 0, 0, 0.5)",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
    },
    "& .MuiInputBase-input": {
      color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.87)",
    },
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="job-application-modal"
    >
      <Fade in={show}>
        <div className="absolute top-1/2 left-1/2 max-w-lg w-11/12 p-6 bg-foreground rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 p-1 text-text/60 hover:text-text rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <Close fontSize="small" />
            </button>

            <Typography
              variant="h5"
              component="h2"
              className="text-text font-semibold mb-4"
            >
              Apply for {jobTitle}
            </Typography>

            {success && (
              <Alert severity="success" className="mb-4">
                Your application has been submitted successfully!
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
              role="form"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                sx={textFieldSx}
                type="tel"
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

              <TextField
                margin="normal"
                fullWidth
                id="coverLetter"
                label="Cover Letter"
                multiline
                rows={4}
                {...register("coverLetter")}
                placeholder="Tell us why you're a good fit for this position"
                sx={textFieldSx}
              />

              <div className="py-2">
                <Typography
                  variant="subtitle1"
                  className="text-text font-medium mb-2"
                >
                  Resume/CV
                </Typography>
                <div>
                  <label htmlFor="resume-upload">
                    <input
                      ref={fileInputRef}
                      className="hidden"
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      className="normal-case text-primary border-primary hover:bg-primary/10"
                    >
                      Upload Resume *
                    </Button>
                  </label>

                  {resume?.name ? (
                    <Typography variant="body2" className="mt-2 text-text">
                      Selected: {resume.name}
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="mt-2 text-text/60">
                      No file selected
                    </Typography>
                  )}

                  {errors.resume && (
                    <Typography
                      variant="caption"
                      color="error"
                      className="block mt-1"
                    >
                      {errors.resume.message}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    className="block mt-1 text-text/60"
                  >
                    Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                  </Typography>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-2">
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  startIcon={<Cancel />}
                  className="normal-case border-primary text-primary hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={16} /> : <Send />
                  }
                  className="normal-case bg-primary text-white hover:bg-primary/90 disabled:bg-primary/70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default JobApplicationModalPresenter;
