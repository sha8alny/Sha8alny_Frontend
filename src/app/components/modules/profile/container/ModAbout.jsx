import Dialog from "@/app/components/ui/DialogMod";
import ModAboutPresentation from "../presentation/ModAboutPresentation";
import { useState } from "react";
import AddButton from "@/app/components/ui/AddButton";
import EditButton from "@/app/components/ui/EditButton";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

/**
 * ModAbout component for editing or adding user profile's about section
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.about - The current about text of the user
 * @param {boolean} [props.adding=false] - Flag indicating whether the component is in adding mode (true) or editing mode (false)
 * 
 * @returns {JSX.Element} A Dialog component containing the about section editor
 * 
 * @example
 * // Edit existing about text
 * <ModAbout about="Current about text" />
 * 
 * // Add new about text
 * <ModAbout about="" adding={true} />
 */
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
