"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPeopleAlsoViewed,
  fetchUserProfile,
  sendMessageRequest,
} from "@/app/services/userProfile";
import ProfilePresentation, {
  ProfileSkeleton,
} from "../presentation/ProfilePresentation";
import {
  IsMyProfileProvider,
  useIsMyProfile,
} from "@/app/context/IsMyProfileContext";
import { useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  connectUser,
  fetchPeopleYouMayKnow,
  followUser,
  handleConnectionRequest,
  removeConnection,
  unFollowUser,
} from "@/app/services/connectionManagement";
import { blockUser, report, unblockUser } from "@/app/services/privacy";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Calculates the profile strength percentage based on profile completeness
 * @param {Object} userProfile - The user profile object
 * @returns {number} - Profile strength score from 0 to 100
 */
const determineStrength = (userProfile) => {
  if (!userProfile) return 0;
  const hasItems = (array) => Array.isArray(array) && array.length > 0;
  const hasContent = (text) => !!text?.trim();
  const strengthFactors = [
    { condition: !!userProfile?.profilePicture, weight: 10 },
    { condition: hasItems(userProfile?.experience), weight: 20 },
    { condition: hasItems(userProfile?.education), weight: 15 },
    { condition: hasItems(userProfile?.skills), weight: 15 },
    { condition: hasContent(userProfile?.about), weight: 10 },
    { condition: (userProfile?.connectionsCount || 0) > 0, weight: 30 },
  ];
  return strengthFactors.reduce(
    (total, factor) => total + (factor.condition ? factor.weight : 0),
    0
  );
};

/**
 * Converts the profile strength score to a label
 * @param {number} strength - The profile strength score
 * @returns {string} - The label for the profile strength
 */
const getStrengthLabel = (strength) => {
  if (strength >= 80) return "All-Star";
  if (strength >= 60) return "Strong";
  if (strength >= 40) return "Intermediate";
  if (strength >= 20) return "Weak";
  return "Very Weak";
};

/**
 * Converts the profile strength score to a color class
 * @param {number} strength - The profile strength score
 * @returns {string} - The color class for the profile strength
 */
const getStrengthColor = (strength) => {
  if (strength >= 80) return "bg-green-500"; // Green
  if (strength >= 60) return "bg-yellow-500"; // Yellow
  if (strength >= 40) return "bg-orange-500"; // Orange
  if (strength >= 20) return "bg-red-500"; // Red
  return "bg-red-700"; // Dark Red
};

/**
 *
 * @param {string} username - The username of the profile to display
 * @returns {JSX.Element} Returns the ProfileContainer component
 */
export const ProfileContainer = ({ username }) => {
  if (!username || username === "") {
    return (
      <div className="w-full h-full flex justify-center items-center text-red-400">
        No username provided.
      </div>
    );
  }

  return (
    <IsMyProfileProvider>
      <ProfileContent username={username} />
    </IsMyProfileProvider>
  );
};

/**
 * Renders the content of a user's profile page.
 *
 * @param {Object} props - The component props
 * @param {string} props.username - The username of the profile to display
 *
 * @returns {JSX.Element} Returns one of the following:
 * - A loading skeleton while data is being fetched
 * - An error message if fetching fails
 * - A "private profile" message if the profile is not visible
 * - The full profile presentation component with user data and profile strength metrics
 *
 * @component
 * @example
 * return (
 *   <ProfileContent username="johnDoe" />
 * )
 */
function ProfileContent({ username }) {
  const { setIsMyProfile } = useIsMyProfile();
  const [copied, setCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [hoverCover, setHoverCover] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const [removeConnectionModalOpen, setRemoveConnectionModalOpen] =
    useState(false);
  const [blockUserModalOpen, setBlockUserModalOpen] = useState(false);
  const [reportUserModalOpen, setReportUserModalOpen] = useState(false);
  const [reportState, setReportState] = useState(0);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const openFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = ""; // Restore scrolling
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: "always",
    refecthOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleReportMutation = useMutation({
    mutationFn: (params) => {
      const { username, reportObj } = params;

      return report(null, null, username, null, null, reportObj);
    },
    onMutate: () => {
      setReportState(1);
    },
    onSuccess: () => {
      setReportState(2);
    },
    onError: (error) => {
      console.error("Error reporting post:", error);
      setReportState(3);
    },
    onSettled: () => {
      setTimeout(() => {
        setReportUserModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
    },
  });

  const handleRemoveConnectionMutation = useMutation({
    mutationFn: () => removeConnection(userProfile?.username),
    onSuccess: () => {
      removeConnectionModalOpen(false);
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["connections"]);
      toast("Connection removed successfully");
    },
    onError: (error) => {
      console.error("Error removing connection:", error);
      toast("Failed to remove connection", false);
    },
  });

  const handleBlockMutation = useMutation({
    mutationFn: () => blockUser(userProfile?.username),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["connections"]);
      toast("User blocked successfully");
      setBlockUserModalOpen(false);
    },
  });

  const handleUnblockMutation = useMutation({
    mutationFn: () => unblockUser(userProfile?.username),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["connections"]);
      toast("User unblocked successfully");
      setBlockUserModalOpen(false);
    },
  });

  const handleFollowMutation = useMutation({
    mutationFn: () => followUser(userProfile?.username),
    onSuccess: () => {
      toast("User followed successfully");
      setIsFollowing(true);
    },
  });

  const handleUnfollowMutation = useMutation({
    mutationFn: () => unFollowUser(userProfile?.username),
    onSuccess: () => {
      toast("User unfollowed successfully");
      setIsFollowing(false);
    },
  });

  const handleMessageRequest = useMutation({
    mutationFn: () => sendMessageRequest(userProfile?.username),
    onSuccess: () => {
      toast("Message request sent successfully!");
    },
    onError: (error) => {
      console.log("Error sending message request:", error.status);
      if (error.status === 403) {
        toast("You cannot send a message request to this user.", false);
      } else if (error.status === 404) {
        toast("User not found.", false);
      } else if (error.status === 400) {
        toast("You have already sent a message request to this user.", false);
      }
    },
  });

  useEffect(() => {
    if (!userProfile) return;
    if (userProfile?.isMyProfile) {
      setIsMyProfile(userProfile.isMyProfile);
    }
    setIsFollowing(userProfile?.isFollowing || false);
  }, [userProfile, setIsMyProfile]);

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    let errorMessage = "Error fetching user profile.";
    console.log("Error details:", error);

    if (error?.response?.status) {
      const status = error.response.status;
      switch (status) {
        case 404:
          errorMessage = "User profile not found.";
          break;
        case 403:
          errorMessage = "You don't have permission to view this profile.";
          break;
        case 401:
          errorMessage = "Authentication required to access this profile.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = `Error fetching profile: ${status}`;
      }
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-background text-red-400">
        {errorMessage}
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background text-red-400">
        Profile data is unavailable.
      </div>
    );
  }

  const strength = determineStrength(userProfile);
  const profileStrength = {
    strength,
    label: getStrengthLabel(strength),
    color: getStrengthColor(strength),
    hasProfile:
      !!userProfile?.profilePicture && userProfile?.profilePicture !== "",
    hasAbout: userProfile?.about != null && userProfile?.about !== "",
    hasEducation: userProfile?.education?.length > 0,
    hasExperience: userProfile?.experience?.length > 0,
    hasSkills: userProfile?.skills?.length > 0,
    hasConnections: userProfile?.connectionsCount > 0,
  };

  const changeRelation = (relation) => {
    switch (relation) {
      case 0:
        return "3rd+";
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return "";
    }
  };

  const changeRelations = (users) => {
    return users.map((user) => ({
      ...user,
      relation: changeRelation(user?.connectionDegree),
    }));
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleReport = () => {
    if (!userProfile?.username) {
      console.error("Cannot report: username is missing or invalid.");
      setReportState(3);
      setTimeout(() => {
        setReportUserModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
      return;
    }

    const reportObj = {
      reason: reportType,
      text: reportType === "Something Else" ? reportText : null,
    };
    handleReportMutation.mutate({ username: userProfile?.username, reportObj });
  };

  const handleBlock = () => {
    if (!userProfile?.username) {
      console.error("Cannot block: username is missing or invalid.");
      return;
    }
    if (userProfile?.isBlocked) {
      handleUnblockMutation.mutate(userProfile?.username);
    } else {
      handleBlockMutation.mutate(userProfile?.username);
    }
  };

  const handleFollow = () => {
    if (!userProfile?.username) {
      console.error("Cannot follow: username is missing or invalid.");
      return;
    }
    if (isFollowing) {
      handleUnfollowMutation.mutate(userProfile?.username);
    } else {
      handleFollowMutation.mutate(userProfile?.username);
    }
  };

  const handleRemoveConnection = () => {
    if (!userProfile?.username) {
      console.error(
        "Cannot remove connection: username is missing or invalid."
      );
      return;
    }
    handleRemoveConnectionMutation.mutate(userProfile?.username);
  };

  const handleSendMessageRequest = () => {
    if (!userProfile?.username) {
      console.error(
        "Cannot send message request: username is missing or invalid."
      );
      return;
    }
    handleMessageRequest.mutate(userProfile?.username);
  };

  return (
    <ProfilePresentation
      userProfile={{
        ...userProfile,
        relation: changeRelation(userProfile?.relation),
        isFollowing: isFollowing,
      }}
      onEmail={handleEmail}
      onCopy={copyToClipboard}
      copied={copied}
      profileStrength={profileStrength}
      isMyProfile={userProfile?.isMyProfile || false}
      fullscreenImage={fullscreenImage}
      setHoverCover={setHoverCover}
      setHoverProfile={setHoverProfile}
      openFullscreen={openFullscreen}
      closeFullscreen={closeFullscreen}
      fetchPeopleAlsoViewed={fetchPeopleAlsoViewed}
      fetchPeopleYouMayKnow={fetchPeopleYouMayKnow}
      navigateTo={navigateTo}
      changeRelations={changeRelations}
      onReport={handleReport}
      reportState={reportState}
      reportUserModalOpen={reportUserModalOpen}
      setReportUserModalOpen={setReportUserModalOpen}
      reportType={reportType}
      setReportType={setReportType}
      reportText={reportText}
      setReportText={setReportText}
      blockUserModalOpen={blockUserModalOpen}
      setBlockUserModalOpen={setBlockUserModalOpen}
      removeConnectionModalOpen={removeConnectionModalOpen}
      setRemoveConnectionModalOpen={setRemoveConnectionModalOpen}
      isReporting={handleReportMutation.isPending}
      isReportingError={handleReportMutation.isError}
      onBlock={handleBlock}
      isBlocking={handleBlockMutation.isPending || handleUnblockMutation.isPending}
      isBlockingError={handleBlockMutation.isError || handleUnblockMutation.isError}
      onFollow={handleFollow}
      isHandlingFollow={handleFollowMutation.isPending}
      isHandlingFollowError={handleFollowMutation.isError}
      onRemoveConnection={handleRemoveConnection}
      isRemovingConnection={handleRemoveConnectionMutation.isPending}
      isRemovingConnectionError={handleRemoveConnectionMutation.isError}
      onSendMessageRequest={handleSendMessageRequest}
      isSendingMessageRequest={handleMessageRequest.isPending}
    />
  );
}
