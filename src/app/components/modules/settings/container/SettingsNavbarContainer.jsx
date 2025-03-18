"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/app/services/userProfile";
import { useRouter } from "next/navigation";
import SettingsNavbarPresentation from "../presentation/SettingsNavbarPresentation";
/**
 * SettingsNavbarContainer component.
 *
 * This component is responsible for managing the state and logic for the settings navbar.
 * It fetches the user profile data, handles navigation, and manages the visibility of the tooltip.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 */
const SettingsNavbarContainer = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile("john"),
  });

  const profilePictureUrl = user?.profile_picture_url;
  const headline = user?.headline;
  const name = user?.name;
  const router = useRouter();

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleHomeNavigation = () => {
    router.push("/");
  };

  const handleProfileClick = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  const handleViewProfile = () => {
    router.push("/profile");
  };

  const handleSignOut = () => {
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setTooltipVisible(false);
      }
    };

    if (isTooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTooltipVisible]);

  return (
    <SettingsNavbarPresentation
      profilePictureUrl={profilePictureUrl}
      headline={headline}
      name={name}
      isTooltipVisible={isTooltipVisible}
      handleHomeNavigation={handleHomeNavigation}
      handleProfileClick={handleProfileClick}
      handleViewProfile={handleViewProfile}
      tooltipRef={tooltipRef}
      profileButtonRef={profileButtonRef}
      handleSignOut={handleSignOut}
    />
  );
};

export default SettingsNavbarContainer;