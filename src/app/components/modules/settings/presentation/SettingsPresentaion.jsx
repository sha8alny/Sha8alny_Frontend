import SettingsAccountPrefsContainer from "../container/SettingsAccountPrefsContainer";
import SettingsSecurityContainer from "../container/SettingsSecurityContainer";
import SettingsSidebarContainer from "../container/SettingsSidebarContainer";
import SettingsNavbarContainer from "../container/SettingsNavbarContainer";

/**
 * SettingsPresentation component renders the main settings page layout.
 *
 * @param {Object} props - The component props.
 * @param {string} props.profilePictureUrl - The URL of the profile picture.
 * @param {string} props.activeSetting - The currently active setting.
 * @param {function} props.handleSetActiveSetting - Function to handle setting the active setting.
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsPresentation({
  profilePictureUrl,
  activeSetting,
  handleSetActiveSetting,
}) {
  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-x-hidden overflow-y-scroll">
      <SettingsNavbarContainer />
      <div className="flex flex-col md:flex-row h-full">
        <SettingsSidebarContainer
          profilePictureUrl={profilePictureUrl}
          setActiveSetting={handleSetActiveSetting}
        />
        <div className="flex flex-col gap-4 p-8 rounded-lg h-full w-full">
          {activeSetting === "Account Preferences" && (
            <SettingsAccountPrefsContainer />
          )}
          {activeSetting === "Sign in & Security" && (
            <SettingsSecurityContainer />
          )}
          {activeSetting === "Notifications" && "Notifications"}
          {activeSetting === "Privacy" && "Privacy"}
          {activeSetting === "Help" && "Help"}
        </div>
      </div>
    </div>
  );
}
