import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../../services/userManagement";
import ChangePasswordForm from "../presentation/ChangePasswordForm";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

/**
 * @namespace settings
 * @module settings
 */
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

  const [errors, setErrors] = useState({
    currPassError: "",
    newPassError: "",
    confirmPassError: "",
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const router = useRouter();
  const showToast = useToast();

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

  const validateAllFields = (updatedValues) => {
    const { currentPassword, newPassword, confirmPassword } = updatedValues;
    let newErrors = {
      currPassError: "",
      newPassError: "",
      confirmPassError: "",
    };

    if (!currentPassword) {
      newErrors.currPassError = "Your current password is required.";
    }

    if (newPassword.length < 8 && newPassword.length !== 0) {
      newErrors.newPassError = "Your password is too short. It should be at least 8 characters long.";
    } else if (newPassword.length > 200) {
      newErrors.newPassError = "Your password is too long. It can’t be more than 200 characters.";
    } else if (newPassword === currentPassword && newPassword !== "") {
      newErrors.newPassError = "Your new password cannot be the same as your current password.";
    }

    if (confirmPassword.length < 8 && confirmPassword.length !== 0) {
      newErrors.confirmPassError = "Your password is too short. It should be at least 8 characters long.";
    } else if (confirmPassword !== newPassword && confirmPassword !== "") {
      newErrors.confirmPassError = "Passwords do not match.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      showToast("Password updated successfully");
      toggleForm();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error?.message || "Something went wrong";
      showToast(message, false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...passwords, [name]: value };
    setPasswords(updatedValues);
    validateAllFields(updatedValues);
  };

  const handleForgetPassword = () => {
    router.push("/forgot-password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAllFields(passwords);

    const hasErrors = Object.values(validationErrors).some((err) => err !== "");
    const hasEmptyFields = Object.values(passwords).some((val) => !val);

    if (hasEmptyFields) {
      showToast("Please fill in all fields", false);
      return;
    }

    if (hasErrors) {
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
