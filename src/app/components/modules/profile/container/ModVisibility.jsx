import Dialog from "@/app/components/ui/DialogMod";
import ModVisibilityPresentation from "../presentation/ModVisibilityPresentation";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateUsername } from "@/app/services/userManagement";
import { useMutation } from "@tanstack/react-query";

/**
 * @namespace profile
 * @module profile
 * @description Component for managing profile visibility settings and username modification
 */

/**
 * ModVisibility - Container component for profile visibility settings and username management
 * 
 * This component provides functionality to:
 * 1. Change profile visibility between Public and Private
 * 2. Update username with validation
 * 3. Display success/error states during updates
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userInfo - User information object
 * @param {string} props.userInfo.visibility - Current visibility setting (Public/Private)
 * @param {string} props.userInfo.username - Current username
 * @returns {JSX.Element} Dialog component with visibility and username management UI
 */
export default function ModVisibility({ userInfo }) {
  // State for profile visibility setting
  const [visibility, setVisibility] = useState(userInfo?.visibility || "Public");
  // Track if username has been modified from original
  const [userModified, setUserModified] = useState(false);
  // State for username input field
  const [username, setUsername] = useState(userInfo?.username || "");
  // General error state for the component
  const [error, setError] = useState(null);
  // Username-specific validation errors
  const [usernameError, setUsernameError] = useState(null);
  // UI flow stage (0: initial, 1: loading, 2: success, 3: error)
  const [currentStage, setCurrentStage] = useState(0);
  // Dialog open/close state
  const [open, setOpen] = useState(false);

  const useUpdate = useUpdateProfile();
  const router = useRouter();
  
  /**
   * Mutation for updating the username
   * On success, shows success state and redirects to the new profile URL
   * On error, displays error and reverts to original username
   */
  const updateUsernameMutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      setCurrentStage(2);
      setTimeout(() => {
        router.push(`/u/${username}`);
      }, 2000);
    },
    onError: (error) => {
      setError(error?.message || "Failed to update username.");
      setCurrentStage(3);
      setTimeout(() => {
        setUsername(userInfo?.username || "");
        setUsernameError(null);
        setUserModified(false);
        setError(null);
        setCurrentStage(0);
      }, 2000);
    }
  });

  const usernameCopy = username;

  /**
   * Handles username input change events
   * Validates username in real-time and provides appropriate error messages
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { value } = e.target;
    setUsername(value);

    if (value !== usernameCopy) {
      setUserModified(true);
    } else {
      setUserModified(false);
    }

    if (value.length < 3 || value.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters.");
    } else if (!/^[a-zA-Z0-9_\-]+$/.test(value)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores."
      );
    } else {
      setUsernameError(null);
    }
  };

  /**
   * Handles save button click for username updates
   * Validates before submission and triggers update mutation
   */
  const handleSave = () => {
    if (userModified) {
      if (usernameError) {
        return;
      }
      setCurrentStage(1);
      updateUsernameMutation.mutate({ newUsername: username });
    } else {
      setUsernameError("Please modify your username.");
    }
  };

  /**
   * Updates the profile visibility setting
   * 
   * @param {string} value - New visibility value ('Public' or 'Private')
   */
  const modifyVisibility = (value) => {
    useUpdate.mutate(
      {
        api: "settings/update-visibility",
        method: "PUT",
        data: { visibility: value },
      },
      {
        onSuccess: () => {
          setVisibility(value);
        },
        onError: (error) => {
          setError(error?.message || "Failed to update visibility.");
          setCurrentStage(3);
          setTimeout(() => {
            setCurrentStage(0);
            setOpen(false);
          }, 2000);
        },
      }
    );
  };
  
  return (
    <Dialog
      useRegularButton
      open={open}
      onOpenChange={setOpen}
      buttonClass="cursor-pointer size-3 mr-2"
      className="max-w-screen"
      testId="mod-visibility"
      buttonData={<Pencil />}
      AlertContent={
        <ModVisibilityPresentation
          currentStage={currentStage}
          handleSave={handleSave}
          setOpen={setOpen}
          usernameError={usernameError}
          handleChange={handleChange}
          modifyVisibility={modifyVisibility}
          visibility={visibility}
          error={error}
          username={username}
          modifyingVisibility={updateUsernameMutation.isPending}
        />
      }
    />
  );
}
