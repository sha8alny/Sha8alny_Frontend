"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SettingsPresentation from "../presentation/SettingsPresentaion";
import { useSearchParams } from "next/navigation";
import { checkHasPassword } from "@/app/services/userManagement";
/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsContainer component manages the state and logic for the settings page.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsContainer() {
  const activeURL = useSearchParams();
  const section = activeURL.get("section");
  const [activeSetting, setActiveSetting] = useState(section || "Account Preferences");
  
  const { data: hasPasswordData, isLoading: isLoadingHasPassword } = useQuery({
    queryKey: ['hasPassword'],
    queryFn: checkHasPassword,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasPassword = hasPasswordData
  
  return (
    <SettingsPresentation 
      activeSetting={activeSetting}
      setActiveSetting={setActiveSetting}
      hasPassword={hasPassword}
      isLoadingHasPassword={isLoadingHasPassword}
    />
  );
}