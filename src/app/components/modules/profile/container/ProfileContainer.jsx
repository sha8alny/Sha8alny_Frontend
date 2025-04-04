"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/app/services/userProfile";
import ProfilePresentation, { ProfileSkeleton } from "../presentation/ProfilePresentation";
import { IsMyProfileProvider, useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { useEffect } from "react";


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
  
  const {
    data: userProfile,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    if (!userProfile) return;
    if (userProfile?.isMyProfile) {
      setIsMyProfile(userProfile.isMyProfile);
    }
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
    hasProfile: !!userProfile?.profilePicture && userProfile?.profilePicture !== "",
    hasAbout: userProfile?.about != null && userProfile?.about !== "",
    hasEducation: userProfile?.education?.length > 0,
    hasExperience: userProfile?.experience?.length > 0, 
    hasSkills: userProfile?.skills?.length > 0,
    hasConnections: userProfile?.connectionsCount > 0,
  };

  return (
    <ProfilePresentation
      userProfile={userProfile}
      profileStrength={profileStrength}
      isMyProfile={userProfile?.isMyProfile || false}
    />
  );
}
