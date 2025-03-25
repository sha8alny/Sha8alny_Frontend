"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/app/services/userProfile";
import ProfilePresentation, { ProfileSkeleton } from "../presentation/ProfilePresentation";
import { IsMyProfileProvider, useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { useEffect } from "react";


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

function ProfileContent({ username }) {
  const { setIsMyProfile } = useIsMyProfile();
  
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
    staleTime: 1000 * 30, // 30 seconds
  });
  
  useEffect(() => {
    if (!userProfile) return;
    if (userProfile?.isMyProfile) {
      setIsMyProfile(userProfile.isMyProfile);
    }
  }, [userProfile, setIsMyProfile]);
  
  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-red-400">
        Error fetching user profile.
      </div>
    );
  }



  if (!userProfile.isVisible) {
    return (
      <div className="size-full flex items-center justify-center bg-black text-red-400">
        User profile is private.
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
      isMyProfile={userProfile.isMyProfile}
    />
  );
}
