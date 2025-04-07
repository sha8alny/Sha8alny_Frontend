"use client";

import React, { useState, useEffect } from "react";
import SettingsSidebarPresentation from "../presentation/SettingsSidebarPresentation";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile,fetchUsername } from "@/app/services/userProfile";
/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsSidebarContainer component manages the state and logic for the settings sidebar.
 *
 * @param {Object} props - The component props.
 * @param {string} props.profilePictureUrl - The URL of the profile picture.
 * @param {function} props.setActiveSetting - Function to set the active setting.
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsSidebarContainer({setActiveSetting }) {
  const searchParams = useSearchParams();
  const [highlight, setHighlight] = useState(0);
  const router = useRouter();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(data.username),
  });
  
  const {
      data,
  
    } = useQuery({
      queryKey: ["username"],
      queryFn: fetchUsername,
    });
  
    const profilePictureUrl = user?.profilePicture; 

  const settings = [
    { name: "Account Preferences", id: 0, icon: <PersonIcon /> },
    { name: "Sign in & Security", id: 1, icon: <SecurityIcon /> },
  ];

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const settingIndex = settings.findIndex(s => s.name === section);
      if (settingIndex !== -1) {
        setHighlight(settingIndex);
      }
    }
  }, [searchParams]);
  
  const handleSetActiveSetting = (setting) => {
    setActiveSetting(setting);
    router.push(`/settings?section=${encodeURIComponent(setting)}`);
  };

  const handleChangeSetting = (id, name) => {
    setHighlight(id);
    handleSetActiveSetting(name);
  };

  return (
    <SettingsSidebarPresentation
      profilePictureUrl={profilePictureUrl}
      settings={settings}
      highlight={highlight}
      handleChangeSetting={handleChangeSetting}
    />
  );
}