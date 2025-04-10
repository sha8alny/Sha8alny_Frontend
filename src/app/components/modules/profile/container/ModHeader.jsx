/**
 * @namespace profile
 * @module profile
 */
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ModHeaderPresentation, {
  ModifyProfilePresentation,
} from "../presentation/ModHeaderPresentation";
import { connectUser } from "@/app/services/connectUser";
import { fetchUserProfile } from "@/app/services/userProfile";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import { useEffect, useState } from "react";

export default function ModHeader({ userInfo }) {
  const { isMyProfile } = useIsMyProfile();

  const handleResumeDownload = (username) => {
    // Implement resume download from the server
    window.open(`/api/profile/resume/${username}`, "_blank");
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

export const ModifyProfileContainer = ({ userInfo }) => {
  // Initialize state with user data if available
  const [profilePicture, setProfilePicture] = useState(
    userInfo?.profilePicture || ""
  );
  const [coverPicture, setCoverPicture] = useState(
    userInfo?.coverPicture || ""
  );
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPictureFile, setCoverPictureFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [name, setName] = useState(userInfo?.name || "");
  const [location, setLocation] = useState(userInfo?.location || "");
  const [headline, setHeadline] = useState(userInfo?.headline || "");
  const [resume, setResume] = useState(userInfo?.resume || "");
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState(null);
  const profileUpdate = useUpdateProfile();

  const [nameError, setNameError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [headlineError, setHeadlineError] = useState(null);

  const isLoading = profileUpdate.isPending;
  const isError = profileUpdate.isError;
  const isSuccess = profileUpdate.isSuccess;

  useEffect(() => {
    if (isLoading) {
      setCurrentStage(1); // Loading state
    } else if (isError) {
      setCurrentStage(3); // Error state
      setError(
        profileUpdate.error?.message ||
          "An error occurred while updating your profile"
      );
    } else if (isSuccess) {
      setCurrentStage(2); // Success state
    }
  }, [isLoading, isError, isSuccess, profileUpdate.error]);

  const handleFileChange = (e, setFile, setFileObject) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file object for later upload
      setFileObject(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update basic profile info first
      const profileData = {
        name,
        location,
        headline,
      };

      if (name.length < 3) {
        setNameError("Name must be at least 3 characters long.");
        return;
      } else {
        setNameError(null);
      }

      if (location.length < 3) {
        setLocationError("Location must be at least 3 characters long.");
        return;
      } else {
        setLocationError(null);
      }
      if (headline.length < 3) {
        setHeadlineError("Headline must be at least 3 characters long.");
        return;
      } else {
        setHeadlineError(null);
      }

      await profileUpdate.mutateAsync({
        api: "profile/edit",
        method: "PATCH",
        data: profileData,
      });

      // Handle profile picture upload if changed
      if (profilePictureFile) {
        const profilePicFormData = new FormData();
        profilePicFormData.append("image", profilePictureFile);

        // Determine if we're updating an existing profile picture or adding a new one
        const method = userInfo?.profilePicture ? "PUT" : "POST";

        await profileUpdate.mutateAsync({
          api: "profile/profile-picture",
          method: method,
          data: profilePicFormData,
          isFormData: true,
        });
      }

      // Handle cover photo upload if changed
      if (coverPictureFile) {
        const coverPicFormData = new FormData();
        coverPicFormData.append("image", coverPictureFile);

        // Determine if we're updating an existing cover photo or adding a new one
        const method = userInfo?.coverPicture ? "PUT" : "POST";

        await profileUpdate.mutateAsync({
          api: "profile/cover-photo",
          method: method,
          data: coverPicFormData,
          isFormData: true,
        });
      }

      // Handle resume upload if changed
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resumeFile);

        // Determine if we're updating an existing resume or adding a new one
        const method = userInfo?.resume ? "PUT" : "POST";

        await profileUpdate.mutateAsync({
          api: "profile/upload-resume",
          method: method,
          data: resumeFormData,
          isFormData: true,
        });
      }

      // Success handling is managed by useEffect
    } catch (err) {
      setCurrentStage(3); // Error state
      setError(err.message || "An error occurred during profile update");
    }
  };

  const removeProfilePicture = () => {
    // Send DELETE request to remove profile picture
    if (userInfo?.profilePicture) {
      profileUpdate.mutate({
        api: "profile/profile-picture",
        method: "DELETE",
      });
    }

    setProfilePicture("");
    setProfilePictureFile(null);
  };

  const removeCoverPicture = () => {
    // Send DELETE request to remove cover photo
    if (userInfo?.coverPicture) {
      profileUpdate.mutate({
        api: "profile/cover-photo",
        method: "DELETE",
      });
    }

    setCoverPicture("");
    setCoverPictureFile(null);
  };

  const removeResume = () => {
    // Send DELETE request to remove resume
    if (userInfo?.resume) {
      profileUpdate.mutate({
        api: "profile/upload-resume",
        method: "DELETE",
      });
    }

    setResume("");
    setResumeFile(null);
  };

  const handleRemoveFile = (type) => {
    switch (type) {
      case "profile":
        removeProfilePicture();
        break;
      case "cover":
        removeCoverPicture();
        break;
      case "resume":
        removeResume();
        break;
      default:
        break;
    }
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
      nameError={nameError}
      setNameError={setNameError}
      locationError={locationError}
      setLocationError={setLocationError}
      headlineError={headlineError}
      setHeadlineError={setHeadlineError}
      handleFileChange={(e, fileType) => {
        if (fileType === "profile") {
          handleFileChange(e, setProfilePicture, setProfilePictureFile);
        } else if (fileType === "cover") {
          handleFileChange(e, setCoverPicture, setCoverPictureFile);
        } else if (fileType === "resume") {
          handleFileChange(e, setResume, setResumeFile);
        }
      }}
      removeFile={handleRemoveFile}
      onSubmit={onSubmit}
      // Pass flags to indicate if images are from server (URLs) versus local uploads
      isProfileRemote={
        profilePicture &&
        typeof profilePicture === "string" &&
        !profilePicture.startsWith("data:")
      }
      isCoverRemote={
        coverPicture &&
        typeof coverPicture === "string" &&
        !coverPicture.startsWith("data:")
      }
      isResumeRemote={
        resume && typeof resume === "string" && !resume.startsWith("data:")
      }
    />
  );
};
