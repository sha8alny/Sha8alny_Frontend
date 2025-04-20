import SettingsAccountPrefsContainer from "../container/SettingsAccountPrefsContainer";
import SettingsSecurityContainer from "../container/SettingsSecurityContainer";
import SettingsSidebarContainer from "../container/SettingsSidebarContainer";
import SettingsNavbarContainer from "../container/SettingsNavbarContainer";
import SettingsPrivacyContainer from "../container/SettingsPrivacyContainer";
import { Suspense } from "react";

/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsPresentation component renders the main settings page layout.
 *
 * @param {Object} props - The component props.
 * @param {string} props.activeSetting - The currently active setting.
 * @param {function} props.setActiveSetting - Function to handle setting the active setting.
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsPresentation({
  activeSetting,
  setActiveSetting,
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            Loading...
          </div>
        }
      >
        <SettingsSidebarContainer setActiveSetting={setActiveSetting} />
      </Suspense>

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-8 rounded-lg w-full">
          {activeSetting === "Account Preferences" && (
            <SettingsAccountPrefsContainer />
          )}
          {activeSetting === "Sign in & Security" && (
            <SettingsSecurityContainer />
          )}
          {activeSetting === "Notifications" && "Notifications"}
          {activeSetting === "Privacy & Permissions" && (
            <SettingsPrivacyContainer />
          )}
          {activeSetting === "Help" && "Help"}
        </div>
      </main>
    </div>
  );
}
