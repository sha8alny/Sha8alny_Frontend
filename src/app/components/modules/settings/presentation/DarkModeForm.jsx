import { useTheme } from "../../../../context/ThemeContext";
import { ArrowBack } from "@mui/icons-material";
import RadioBtn from "../../../ui/RadioBtn";
import Settings from "@/app/settings/page";
import SettingsFormLayout from "./SettingsFormLayout";
import BackButton from "./BackButton";
/**
 * DeleteAccountForm component renders a form to delete the user's account.
 * @param {Function} props.handleDarkModeForm - Function to toggle the form visibility.
 * @returns {JSX.Element} The rendered component.
 */
const DarkModeForm = ({ handleDarkModeForm }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SettingsFormLayout>
      <BackButton handler={handleDarkModeForm} />
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-xl font-semibold">Dark Mode</h1>
        <p className="text-text text-sm">
          Choose how your LinkedIn experience looks for this device.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <RadioBtn
          label="Light Mode"
          name="theme"
          value="light"
          checked={theme === "light"}
          onChange={toggleTheme}
        />
        <RadioBtn
          label="Dark Mode"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
      </div>
    </SettingsFormLayout>
  );
};

export default DarkModeForm;
