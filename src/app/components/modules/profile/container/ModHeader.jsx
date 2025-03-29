/**
 * @namespace profile
 * @module profile
 */
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ModHeaderPresentation, {
  ModifyProfilePresentation,
} from "../presentation/ModHeaderPresentation";
import { connectUser } from "@/app/services/connectUser";
import { updateProfile } from "@/app/services/updateProfile";
import { fetchUserProfile } from "@/app/services/userProfile";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import { IsOpenProvider } from "@/app/context/isOpenContext";
import { useEffect, useState } from "react";

export default function ModHeader({ userInfo }) {
  const { isMyProfile } = useIsMyProfile();

  // TODO: Implement the following functions
  const handleResumeDownload = (username) => {
    console.log("Download Resume");
  };

  const handleConnect = (username) => {
    connectUser(username);
    fetchUserProfile(username);
  };

  return (
    <ModHeaderPresentation
      isMyProfile={isMyProfile}
      handleConnect={handleConnect}
      handleResumeDownload={handleResumeDownload}
      userInfo={userInfo}
    />
  );
}

const ModifyContainer = ({ userInfo, handleSubmit }) => {
  return (
    <IsOpenProvider>
      <ModifyProfileContainer userInfo={userInfo} handleSubmit={handleSubmit} />
    </IsOpenProvider>
  );
};

export const ModifyProfileContainer = ({ userInfo }) => {
  const [profilePicture, setProfilePicture] = useState(
    userInfo?.profilePicture || ""
  );
  const [coverPicture, setCoverPicture] = useState(
    userInfo?.coverPicture || ""
  );
  const [name, setName] = useState(userInfo?.name || "");
  const [location, setLocation] = useState(userInfo?.location || "");
  const [headline, setHeadline] = useState(userInfo?.headline || "");
  const [resume, setResume] = useState(userInfo?.resume || "");
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState(null);
  const useUpdate = useUpdateProfile();

  const isLoading = useUpdate.isPending;
  const isError = useUpdate.isError;
  const isSuccess = useUpdate.isSuccess;

  useEffect(() => {
    if (isLoading) {
      setCurrentStage(1); // Loading state
    } else if (isError) {
      setCurrentStage(3); // Error state
      setError(
        updateProfile.error?.message ||
          "An error occurred while updating your profile"
      );
    } else if (isSuccess) {
      setCurrentStage(2); // Success state
    }
  }, [isLoading, isError, isSuccess, updateProfile.error]);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      profilePicture,
      coverPicture,
      name,
      location,
      headline,
    };
    useUpdate.mutate({
      api: "edit",
      method: "PATCH",
      data: { ...data },
    });
    // Add resume logic here.
  };

  const removeFile = (setFile) => {
    setFile(null);
  };

  return (
    <ModifyProfilePresentation
      profilePicture={profilePicture}
      coverPicture={coverPicture}
      setCoverPicture={setCoverPicture}
      setProfilePicture={setProfilePicture}
      name={name}
      setName={setName}
      location={location}
      setLocation={setLocation}
      headline={headline}
      setHeadline={setHeadline}
      userInfo={userInfo}
      resume={resume}
      setResume={setResume}
      currentStage={currentStage}
      setCurrentStage={setCurrentStage}
      error={error}
      setError={setError}
      handleFileChange={handleFileChange}
      removeFile={removeFile}
      onSubmit={onSubmit}
    />
  );
};
