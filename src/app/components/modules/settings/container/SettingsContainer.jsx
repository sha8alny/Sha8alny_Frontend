"use client";

import { useState, useEffect } from "react";

import SettingsPresentation from "../presentation/SettingsPresentaion";
import { useSearchParams } from "next/navigation";

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
  const [activeSetting, setActiveSetting] = useState(section  ||"Account Preferences");



  return (
    <SettingsPresentation 
      activeSetting={activeSetting}
      setActiveSetting={setActiveSetting}
    />
  );
}