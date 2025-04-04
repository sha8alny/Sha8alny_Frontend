"use client";

import { useState, useEffect } from "react";

import SettingsPresentation from "../presentation/SettingsPresentaion";

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
  const [activeSetting, setActiveSetting] = useState("Account Preferences");



  return (
    <SettingsPresentation 
      activeSetting={activeSetting}
      setActiveSetting={setActiveSetting}
    />
  );
}