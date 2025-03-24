import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../../services/userMangment";
import ChangePasswordForm from "../presentation/ChangePasswordForm";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
/**
 * ChangePasswordContainer component handles the logic for changing a user's password.
 * It manages form state, validation, and submission.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.toggleForm - Function to toggle the visibility of the form.
 *
 * @returns {JSX.Element} The rendered ChangePasswordContainer component.
 *
 */

const ChangePasswordContainer = ({ toggleForm }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const [errors, setErrors] = useState({
    currPassError: "",
    newPassError: "",
    confirmPassError: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);
  const router = useRouter();
  const showToast = useToast();
  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      showToast("Password updated successfully");
      toggleForm();
    },
    onError: (error) => {
      showToast("Failed to update password", false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    setErrors((prev) => {
      let updatedErrors = { ...prev };

      if (name === "currentPassword") {
        updatedErrors.currPassError = value
          ? ""
          : "Your current password is required.";
      }

      if (name === "newPassword") {
        updatedErrors.newPassError =
          value.length < 8 && value.length !== 0
            ? "Your password is too short. It should be at least 8 characters long."
            : value.length > 200
            ? "Your password is too long. It can’t be more than 200 characters."
            : "";
      }

      if (name === "confirmPassword") {
        updatedErrors.confirmPassError =
          value.length < 8 && value.length !== 0
            ? "Your password is too short. It should be at least 8 characters long."
            : value !== passwords.newPassword
            ? "Passwords do not match."
            : "";
      }

      return updatedErrors;
    });
  };


  const handleForgetPassword = () => {
    router.push("/forgot-password"); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      showToast("Please fill in all fields", false);

      return;
    }

    if (
      errors.currPassError ||
      errors.newPassError ||
      errors.confirmPassError
    ) {
      showToast("Please fix validation errors before submitting", false);

      return;
    }

    mutation.mutate({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
  };

  return (
    <ChangePasswordForm
      passwords={passwords}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      toggleForm={toggleForm}
      showTooltip={showTooltip}
      setShowTooltip={setShowTooltip}
      tooltipRef={tooltipRef}
      handleForgetPassword={handleForgetPassword}
    />
  );
};

export default ChangePasswordContainer;
