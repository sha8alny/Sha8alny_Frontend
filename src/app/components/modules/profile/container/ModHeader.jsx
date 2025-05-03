/**
 * @namespace profile
 * @module profile
 */
"use client";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ModHeaderPresentation, {
  ModifyProfilePresentation,
} from "../presentation/ModHeaderPresentation";
import { fetchUserProfile } from "@/app/services/userProfile";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import { useEffect, useState } from "react";
import {
  connectUser,
  handleConnectionRequest,
} from "@/app/services/connectionManagement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";

export default function ModHeader({ userInfo }) {
  const { isMyProfile } = useIsMyProfile();
  const [connectionStatus, setConnectionStatus] = useState(
    userInfo?.connectionStatus || "notConnected"
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  const handleResumeDownload = () => {
    if (!userInfo?.resume) return;
    const link = document.createElement("a");
    link.href = userInfo.resume;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleConnectMutate = useMutation({
    mutationFn: (username) => connectUser(username),
    onSuccess: () => {
      setConnectionStatus("pending");
    },
  });

  const handleConnectionRequestMutate = useMutation({
    mutationFn: (action) => handleConnectionRequest(userInfo?.username, action),
    onSuccess: (_data, action) => {
      if (action === "ACCEPT") {
        setConnectionStatus("connected");
      } else if (action === "DECLINE") {
        setConnectionStatus("notConnected");
      }
    },
  });

  const handleClick = (action = "DECLINE") => {
    switch (userInfo?.connectionStatus) {
      case "connected":
        router.push(`/messages?username=${userInfo.username}`);
        break;
      case "notConnected":
        handleConnectMutate.mutate(userInfo?.username);
        break;
      case "requestReceived":
        handleConnectionRequestMutate.mutate(action);
        break;
      case "pending":
        toast("You have already sent a connection request");
        break;
    }
  };

  const isConnecting = handleConnectMutate.isPending;
  const isHandlingRequest = handleConnectionRequestMutate.isPending;

  return (
    <ModHeaderPresentation
      isMyProfile={isMyProfile}
      handleClick={handleClick}
      handleResumeDownload={handleResumeDownload}
      userInfo={{ ...userInfo, connectionStatus: connectionStatus }}
      isConnecting={isConnecting}
      isHandlingRequest={isHandlingRequest}
    />
  );
}

export const ModifyProfileContainer = ({ userInfo }) => {
  const [profilePicture, setProfilePicture] = useState(
    userInfo?.profilePicture || ""
  );
  const [coverPicture, setCoverPicture] = useState(userInfo?.coverPhoto || "");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPictureFile, setCoverPictureFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const [isCoverPictureLoading, setIsCoverPictureLoading] = useState(false);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  const [profilePictureError, setProfilePictureError] = useState(null);
  const [coverPictureError, setCoverPictureError] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  const [name, setName] = useState(userInfo?.name || "");
  const [location, setLocation] = useState(userInfo?.location || "");
  const [headline, setHeadline] = useState(userInfo?.headline || "");
  const [industry, setIndustry] = useState(userInfo?.industry || "");
  const [resume, setResume] = useState(userInfo?.resume || "");
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState(null);
  const profileUpdate = useUpdateProfile();

  const [nameError, setNameError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [headlineError, setHeadlineError] = useState(null);
  const [industryError, setIndustryError] = useState(null);

  const isLoading = profileUpdate.isPending;
  const isError = profileUpdate.isError;
  const isSuccess = profileUpdate.isSuccess;

  useEffect(() => {
    if (isLoading) {
      setCurrentStage(1);
    } else if (isError) {
      setCurrentStage(3);
      setError(
        profileUpdate.error?.message ||
          "An error occurred while updating your profile"
      );
    } else if (isSuccess) {
      setCurrentStage(2);
    }
  }, [isLoading, isError, isSuccess, profileUpdate.error]);

  const MAX_SIZE = 50 * 1024 * 1024;

  const VALID_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  const VALID_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (fileType) {
      case "profile":
        setProfilePictureError(null);

        if (file.size > MAX_SIZE) {
          setProfilePictureError("File size exceeds 50MB limit");
          return;
        }

        if (!VALID_IMAGE_TYPES.includes(file.type)) {
          setProfilePictureError(
            "File must be an image (JPEG, PNG, GIF, WebP, or SVG)"
          );
          return;
        }

        setIsProfilePictureLoading(true);
        setProfilePictureFile(file);
        const profileReader = new FileReader();
        profileReader.onloadend = () => {
          setProfilePicture(profileReader.result);
          setIsProfilePictureLoading(false);
        };
        profileReader.onerror = () => {
          setProfilePictureError("Failed to read file");
          setIsProfilePictureLoading(false);
        };
        profileReader.readAsDataURL(file);
        break;

      case "cover":
        setCoverPictureError(null);

        if (file.size > MAX_SIZE) {
          setCoverPictureError("File size exceeds 50MB limit");
          return;
        }

        if (!VALID_IMAGE_TYPES.includes(file.type)) {
          setCoverPictureError(
            "File must be an image (JPEG, PNG, GIF, WebP, or SVG)"
          );
          return;
        }

        setIsCoverPictureLoading(true);
        setCoverPictureFile(file);
        const coverReader = new FileReader();
        coverReader.onloadend = () => {
          setCoverPicture(coverReader.result);
          setIsCoverPictureLoading(false);
        };
        coverReader.onerror = () => {
          setCoverPictureError("Failed to read file");
          setIsCoverPictureLoading(false);
        };
        coverReader.readAsDataURL(file);
        break;

      case "resume":
        setResumeError(null);

        if (file.size > MAX_SIZE) {
          setResumeError("File size exceeds 50MB limit");
          return;
        }

        if (!VALID_RESUME_TYPES.includes(file.type)) {
          setResumeError("File must be a PDF or Word document");
          return;
        }

        setIsResumeLoading(true);
        setResumeFile(file);
        const resumeReader = new FileReader();
        resumeReader.onloadend = () => {
          setResume(resumeReader.result);
          setIsResumeLoading(false);
        };
        resumeReader.onerror = () => {
          setResumeError("Failed to read file");
          setIsResumeLoading(false);
        };
        resumeReader.readAsDataURL(file);
        break;

      default:
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileData = {
        name,
        location,
        headline,
        industry,
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

      if (industry.length < 3) {
        setIndustryError("Industry must be at least 3 characters long.");
        return;
      } else {
        setIndustryError(null);
      }

      await profileUpdate.mutateAsync({
        api: "profile/edit",
        method: "PATCH",
        data: profileData,
      });

      if (profilePictureFile) {
        const profilePicFormData = new FormData();
        if (profilePictureFile instanceof File && profilePictureFile.size > 0) {
          profilePicFormData.append("profilePicture", profilePictureFile);

          await profileUpdate.mutateAsync({
            api: "profile/profile-picture",
            method: "PUT",
            data: profilePicFormData,
            isFormData: true,
          });
        }
      }

      if (coverPictureFile) {
        const coverPicFormData = new FormData();
        if (coverPictureFile instanceof File && coverPictureFile.size > 0) {
          coverPicFormData.append("coverPhoto", coverPictureFile);

          await profileUpdate.mutateAsync({
            api: "profile/cover-photo",
            method: "PUT",
            data: coverPicFormData,
            isFormData: true,
          });
        }
      }

      if (resumeFile) {
        const resumeFormData = new FormData();
        if (resumeFile instanceof File && resumeFile.size > 0) {
          resumeFormData.append("resume", resumeFile);

          await profileUpdate.mutateAsync({
            api: "profile/upload-resume",
            method: "POST",
            data: resumeFormData,
            isFormData: true,
          });
        }
      }
    } catch (err) {
      setCurrentStage(3);
      setError(err.message || "An error occurred during profile update");
    }
  };

  const removeProfilePicture = () => {
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
    if (userInfo?.coverPhoto) {
      profileUpdate.mutate({
        api: "profile/cover-photo",
        method: "DELETE",
      });
    }

    setCoverPicture("");
    setCoverPictureFile(null);
  };

  const removeResume = () => {
    if (userInfo?.resume) {
      profileUpdate.mutate({
        api: "profile/delete-resume",
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
        setProfilePictureError(null);
        break;
      case "cover":
        removeCoverPicture();
        setCoverPictureError(null);
        break;
      case "resume":
        removeResume();
        setResumeError(null);
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
      handleFileChange={handleFileChange}
      removeFile={handleRemoveFile}
      onSubmit={onSubmit}
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
      isProfilePictureLoading={isProfilePictureLoading}
      isCoverPictureLoading={isCoverPictureLoading}
      isResumeLoading={isResumeLoading}
      profilePictureError={profilePictureError}
      coverPictureError={coverPictureError}
      resumeError={resumeError}
      industry={industry}
      setIndustry={setIndustry}
      industryError={industryError}
    />
  );
};
