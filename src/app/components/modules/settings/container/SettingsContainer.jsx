"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/app/services/userProfile";
import SettingsPresentation from "../presentation/SettingsPresentaion";

/**
 * SettingsContainer component manages the state and logic for the settings page.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSetting, setActiveSetting] = useState("Account Preferences");

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile("john"),
  });

  const profilePictureUrl = user?.profile_picture_url; 

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSetting(section);
    }
  }, [searchParams]);

  const handleSetActiveSetting = (setting) => {
    setActiveSetting(setting);
    router.push(`/settings?section=${encodeURIComponent(setting)}`);
  };

  return (
    <SettingsPresentation 
      profilePictureUrl={profilePictureUrl}
      activeSetting={activeSetting}
      handleSetActiveSetting={handleSetActiveSetting}
    />
  );
}