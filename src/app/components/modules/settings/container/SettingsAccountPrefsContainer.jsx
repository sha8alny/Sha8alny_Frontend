import { useTheme } from "../../../../context/ThemeContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsAccountPrefsPresentation from "../presentation/SettingsAccountPrefsPresentation";
import DarkModeForm from "../presentation/DarkModeForm";
import DeleteAccountContainer from "./DeleteAccountContainer";
import ChangeUsernameContainer from "./ChangeUsernameContainer";

/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsAccountPrefsContainer component manages the state and logic for the account preferences settings.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function SettingsAccountPrefsContainer() {
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
      <SettingsAccountPrefsPresentation
        theme={theme}
        handleNavigation={handleNavigation}
        setActiveForm={setActiveForm}
      />
    );
  };

  return <>{renderContent()}</>;
}