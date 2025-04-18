import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ChangeEmailForm from "../presentation/ChangeEmailFrom";
import { updateEmail } from "../../../../services/userManagement";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace settings
 * @module settings
 */
/**
 * ChangeEmailContainer component handles the logic for changing the user's email.
 * It includes form validation, mutation for updating the email, and displaying toast notifications.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.toggleForm - Function to toggle the visibility of the form
 * @returns {JSX.Element} The rendered ChangeEmailContainer component
 *
 *
 */

const ChangeEmailContainer = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const showToast = useToast();
  const validate = () => {
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateEmailMutation = useMutation({
    mutationFn: () => updateEmail({ email, password }),
    onSuccess: () => {
      showToast("Email updated successfully");
      toggleForm();
    },
    onError: (error) => {
      showToast(error.message, false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateEmailMutation.mutate();
    }
  };

  return (
    <ChangeEmailForm
      toggleForm={toggleForm}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errors={errors}
      handleSubmit={handleSubmit}
      isLoading={updateEmailMutation.isPending}
    />
  );
};

export default ChangeEmailContainer;
