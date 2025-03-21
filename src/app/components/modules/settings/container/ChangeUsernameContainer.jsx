import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUsername } from "../../../../services/userMangment";
import ChangeUsernameForm from "../presentation/ChangeUsernameForm";
import { useToast } from "@/app/context/ToastContext";
/**
 * ChangeUsernameContainer component handles the logic for changing the username.
 * It manages the state for the username and error messages, and handles form submission.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleUsernameForm - Function to toggle the username form visibility.
 *
 * @returns {JSX.Element} The rendered ChangeUsernameForm component.
 */

const ChangeUsernameContainer = ({ handleUsernameForm }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const showToast = useToast();
  const mutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      showToast("User name updated successfully");
      handleUsernameForm();
    },
    onError: (err) => {
      showToast("Failed to update user name", false);
      setError("Failed to update username.");
    },
  });

  const handleChange = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);

    if (newValue.length === 0) {
      setError("Username is required.");
    } else if (/\d/.test(newValue)) {
      setError("Username cannot contain numeric values.");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error && username) {
      mutation.mutate({ newUsername: username });
    }
  };
  return (
    <ChangeUsernameForm
      username={username}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      toggleForm={handleUsernameForm}
      isLoading={mutation.isLoading}
    />
  );
};

export default ChangeUsernameContainer;
