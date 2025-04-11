import SettingsCard from "./SettingsCard";

/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsAccountPrefsPresentation component renders the account preferences settings.
 *
 * @param {Object} props - The component props.
 * @param {string} props.theme - The current theme.
 * @param {function} props.handleNavigation - Function to handle navigation.
 * @param {function} props.setActiveForm - Function to set the active form.
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsAccountPrefsPresentation({ theme, handleNavigation, setActiveForm }) {
  return (
    <>
      <SettingsCard
        header="Profile information"
        items={{
          "Change username": {
            label: "",
            link: () => setActiveForm("changeUsername"),
          },
        }}
      />
      <SettingsCard
        header="Display"
        items={{
          "Dark mode": {
            label: theme.charAt(0).toUpperCase() + theme.slice(1),
            link: () => setActiveForm("darkMode"),
          },
        }}
      />
      <SettingsCard
        header="Subscriptions & payments"
        items={{
          "Current plan": { label: "", link: () => handleNavigation("/membership-page") },
        }}
      />
      <SettingsCard
        header="Account Management"
        items={{
          "Delete Account": { label: "", link: () => setActiveForm("deleteAccount") },
        }}
      />
    </>
  );
}