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
 * @param {boolean} props.hasPassword - Whether the user has a password set.
 * @param {boolean} props.isLoadingHasPassword - Whether the hasPassword data is loading.
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsPresentation({
  activeSetting,
  setActiveSetting,
  hasPassword,
  isLoadingHasPassword,
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
            <SettingsAccountPrefsContainer 
              hasPassword={hasPassword}
              isLoadingHasPassword={isLoadingHasPassword}
            />
          )}
          {activeSetting === "Sign in & Security" && (
            <SettingsSecurityContainer 
              hasPassword={hasPassword}
              isLoadingHasPassword={isLoadingHasPassword}
            />
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
