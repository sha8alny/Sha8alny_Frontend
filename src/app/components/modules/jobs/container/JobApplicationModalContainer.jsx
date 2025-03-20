import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import JobApplicationModalPresentation from "../presentation/JobApplicationModalPresentation";
import { submitJobApplication } from "@/app/services/jobs";

const jobApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  coverLetter: z.string().optional(),
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
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
    }
  });


  const mutation = useMutation({
    mutationFn: (data) => submitJobApplication(jobId, data, resume),
    onSuccess: () => {
      setSuccess(true);
      reset();
      setResume(null);
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
    setResume(e.target.files[0]);
  };

  return (
    <JobApplicationModalPresentation
      show={show}
      handleClose={handleClose}
      jobTitle={jobTitle}
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      resume={resume}
      handleFileChange={handleFileChange}
      isSubmitting={mutation.isPending}
      success={success}
      error={error}
    />
  );
};

export default JobApplicationModalContainer;
