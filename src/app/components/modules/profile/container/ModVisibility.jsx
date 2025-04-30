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
  const [visibility, setVisibility] = useState(userInfo?.visibility || "Public");
  const [userModified, setUserModified] = useState(false);
  const [username, setUsername] = useState(userInfo?.username || "");
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [open, setOpen] = useState(false);

  const useUpdate = useUpdateProfile();
  const router = useRouter();
  
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
