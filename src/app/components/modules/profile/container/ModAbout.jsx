import Dialog from "@/app/components/ui/DialogMod";
import ModAboutPresentation from "../presentation/ModAboutPresentation";
import { useState } from "react";
import AddButton from "@/app/components/ui/AddButton";
import EditButton from "@/app/components/ui/EditButton";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

export default function ModAbout({ about, adding = false }) {
  const [error, setError] = useState(null);
  const [userAbout, setAbout] = useState(about);
  const updateProfileMutation = useUpdateProfile();

  const handleAbout = (value) => {
    setAbout(value);
    if (value.length > 1000) {
      setError("About is too long.");
      return;
    }
    if (value === about) {
      setError("About hasn't changed.");
      return;
    }
    setError(null);
  };
  const handleSubmit = (data) => {
      updateProfileMutation.mutate({
        api: "edit",
        method: "PATCH",
        data: { about: data },
      });
  };

  return (
    <Dialog
      className="min-w-[60vh]"
      useRegularButton
      buttonData={adding ? <AddButton /> : <EditButton />}
      AlertContent={
        <ModAboutPresentation
          error={error}
          about={userAbout}
          handleAbout={handleAbout}
          handleSubmit={handleSubmit}
          isLoading={updateProfileMutation.isLoading}
        />
      }
    />
  );
}
