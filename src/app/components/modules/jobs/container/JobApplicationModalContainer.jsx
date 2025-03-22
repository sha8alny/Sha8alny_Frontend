import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import JobApplicationModalPresentation from "../presentation/JobApplicationModalPresentation";
import { submitJobApplication } from "@/app/services/jobs";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Define accepted file types for resume uploads
const ACCEPTED_FILE_TYPES = [
  "application/pdf",                                                   // PDF files
  "application/msword",                                                // DOC files
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX files
];

// Define readable extensions for user-friendly error messages
const READABLE_EXTENSIONS = ".pdf, .doc, .docx";
const jobApplicationSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  coverLetter: z.string().optional(),
  resume: z.any()
    .refine(file => !!file, "Resume is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      `Invalid file type. Accepted formats: ${READABLE_EXTENSIONS}`
    )
});



/**
 * JobApplicationModalContainer component handles the logic for the job application modal.
 * It manages form state, validation, file upload, and submission using React Hook Form and React Query.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {Function} props.handleClose - Function to close the modal.
 * @param {string} props.jobId - The ID of the job for which the application is being submitted.
 * @param {string} props.jobTitle - The title of the job for display in the modal.
 *
 * @returns {JSX.Element} The JobApplicationModalContainer component.
 */
const JobApplicationModalContainer = ({ show, handleClose, jobId, jobTitle }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null); // For clearing file input after submission

  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      phone: "",
      coverLetter: "",
      resume: null,
    }
  }); 


  const mutation = useMutation({
    mutationFn: (data) => submitJobApplication(jobId, data, data.resume),
    onSuccess: () => {
      setSuccess(true);
      reset();
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    },
    onError: (error) => {
      setError(error.message || "Failed to submit application");
    },
  });

  const onSubmit = (data) => {
    setError("");
    mutation.mutate(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue("resume", file, { shouldValidate: true }); // Bind file to react-hook-form
  };

  const watchedResume = watch("resume");

  return (
    <JobApplicationModalPresentation
      show={show}
      handleClose={handleClose}
      jobTitle={jobTitle}
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      resume={watchedResume} // Reflect in Presenter
      handleFileChange={handleFileChange}
      fileInputRef={fileInputRef}
      isSubmitting={mutation.isPending}
      success={success}
      error={error}
    />
  );
};

export default JobApplicationModalContainer;
