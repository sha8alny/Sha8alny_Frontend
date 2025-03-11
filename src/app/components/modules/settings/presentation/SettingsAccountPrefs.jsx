import SettingsCard from "./SettingsCard";
import { useTheme } from "../../../../context/ThemeContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DarkModeForm from "./DarkModeForm";
import DeleteAccountContainer from "../container/DeleteAccountContainer";
import ChangeUsernameContainer from "../container/ChangeUsernameContainer";
/**
 * SettingsAccountPrefs component shows all available Account prefrences settings options as cards.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const SettingsAccountPrefs = () => {
  const [activeForm, setActiveForm] = useState(null);
  const router = useRouter();
  const { theme } = useTheme();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const renderContent = () => {
    if (activeForm === "darkMode") return <DarkModeForm handleDarkModeForm={() => setActiveForm(null)} />;
    if (activeForm === "deleteAccount") return <DeleteAccountContainer handleDeleteAccountForm={() => setActiveForm(null)} />;
    if (activeForm === "changeUsername") return <ChangeUsernameContainer handleUsernameForm={() => setActiveForm(null)} />;
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
            "Current plan": { label: "Basic", link: () => handleNavigation("/subscription") },
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
  };

  return <>{renderContent()}</>;
};

export default SettingsAccountPrefs;
