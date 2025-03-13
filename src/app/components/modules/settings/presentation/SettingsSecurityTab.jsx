import ChangeEmailCard from "./ChangeEmailCard";
import SettingsCard from "./SettingsCard";
import ChangePasswordContainer from "../container/ChangePasswordContainer";
/**
 * SettingsSecurityTab component renders different settings forms based on the active form state.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.email - user email.
 * @param {boolean} props.loading - The loading state to indicate if data is being fetched.
 * @param {string} props.activeForm - The currently active form identifier.
 * @param {Function} props.setActiveForm - Function to set the active form state.
 * @returns {JSX.Element} The rendered component.
 */

const SettingsSecurityTab = ({ email, loading, activeForm, setActiveForm }) => {
  const renderContent = () => {
    if (activeForm === "changeEmail")
      return (
        <ChangeEmailCard
          toggleForm={() => setActiveForm(null)}
          email={email}
        />
      );

    if (activeForm === "changePassword")
      return <ChangePasswordContainer toggleForm={() => setActiveForm(null)} />;

    return (
      <SettingsCard
        header="Account access"
        items={{
          "Update email": {
            label: loading ? "Loading..." : email,
            link: () => setActiveForm("changeEmail"),
          },
          "Change password": {
            label: "",
            link: () => setActiveForm("changePassword"),
          },
        }}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default SettingsSecurityTab;
