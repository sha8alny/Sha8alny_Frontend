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
}) => {
  return (
    <Modal
      open={show}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="job-application-title"
      aria-describedby="job-application-description"
    >
      <Fade in={show}>
        <div className="absolute top-1/2 left-1/2 max-w-lg w-11/12 p-5 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <Close
              onClick={handleClose}
              className="absolute top-2 right-2 cursor-pointer"
              aria-label="Close"
            />

            <Typography variant="h5" component="h2" gutterBottom>
              Apply for {jobTitle}
            </Typography>

            {success && (
              <Alert severity="success" className="mb-2">
                Your application has been submitted successfully!
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="mb-2">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-2">
              <div className="flex flex-col md:flex-row gap-4">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </div>

              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                margin="normal"
                fullWidth
                id="coverLetter"
                label="Cover Letter"
                multiline
                rows={5}
                {...register("coverLetter")}
                placeholder="Tell us why you're a good fit for this position"
              />

              <div className="mt-4 mb-4">
                <Typography variant="subtitle1" gutterBottom>
                  Resume/CV
                </Typography>
                <div>
                  <label htmlFor="resume-upload">
                    <input
                      className="hidden"
                      id="resume-upload"
                      name="resume"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                    >
                      Upload Resume
                    </Button>
                  </label>
                  {resume?.name ? (
                    <Typography variant="body2" className="mt-1">
                      Selected: {resume.name}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mt-1"
                    >
                      No file selected
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="block"
                  >
                    Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                  </Typography>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  startIcon={<Cancel />}
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
