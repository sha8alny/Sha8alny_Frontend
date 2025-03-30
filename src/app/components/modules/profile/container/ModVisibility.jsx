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
 */
export default function ModVisibility({ userInfo }) {
  const [visibility, setVisibility] = useState("Public");
  const [userModified, setUserModified] = useState(false);
  const [username, setUsername] = useState(userInfo?.username || "");
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [modifyingVisibility, setModifyingVisibility] = useState(false);
  const [open, setOpen] = useState(false);

  const useUpdate = useUpdateProfile();
  const router = useRouter();
  
  // Add TanStack mutation for username update
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
    }
  });

  const usernameCopy = username;

  const handleChange = (e) => {
    const { value } = e.target;
    setUsername(value);

    if (value !== usernameCopy) {
      setUserModified(true);
    } else {
      setUserModified(false);
    }

    // Validate the username
    if (value.length < 3 || value.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters.");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores."
      );
    } else {
      setUsernameError(null);
    }
  };

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

  const modifyVisibility = (value) => {
    setModifyingVisibility(true);
    useUpdate.mutate(
      {
        api: "settings/update-visibility",
        method: "PUT",
        data: { visibility: value }, // Use the passed value directly
      },
      {
        onSuccess: () => {
          setVisibility(value); // Set visibility after successful update
          setModifyingVisibility(false);
        },
        onError: (error) => {
          setError(error?.message || "Failed to update visibility.");
          setCurrentStage(3);
          setModifyingVisibility(false);
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
      buttonClass="hover:cursor-pointer size-4 mr-2"
      buttonData={<Pencil />}
      AlertContent={
        <ModVisibilityPresentation
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
          handleSave={handleSave}
          setOpen={setOpen}
          usernameError={usernameError}
          handleChange={handleChange}
          modifyingVisibility={modifyingVisibility}
          modifyVisibility={modifyVisibility}
          visibility={visibility}
          setVisibility={setVisibility}
          error={error}
          setError={setError}
          username={username}
          setUserModified={setUserModified}
          userModified={userModified}
          setUsername={setUsername}
          isUpdatingUsername={updateUsernameMutation.isPending}
        />
      }
    />
  );
}
