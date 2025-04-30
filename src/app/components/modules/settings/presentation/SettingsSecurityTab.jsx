import ChangeEmailCard from "./ChangeEmailCard";
import SettingsCard from "./SettingsCard";
import ChangePasswordContainer from "../container/ChangePasswordContainer";
import Link from "next/link";

/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsSecurityTab component renders different settings forms based on the active form state.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.email - user email.
 * @param {boolean} props.loading - The loading state to indicate if data is being fetched.
 * @param {string} props.activeForm - The currently active form identifier.
 * @param {Function} props.setActiveForm - Function to set the active form state.
 * @param {boolean} props.hasPassword - Whether the user has a password set.
 * @param {boolean} props.isLoadingHasPassword - Whether the hasPassword data is loading.
 * @returns {JSX.Element} The rendered component.
 */

const SettingsSecurityTab = ({ 
  email, 
  loading, 
  activeForm, 
  setActiveForm, 
  hasPassword, 
  isLoadingHasPassword 
}) => {
  const renderContent = () => {
    if (activeForm === "changeEmail")
      return (
        <ChangeEmailCard
          toggleForm={() => setActiveForm(null)}
          email={email}
        />
      );

    if (activeForm === "changePassword")
      return <ChangePasswordContainer toggleForm={() => setActiveForm(null)} hasPassword={hasPassword} />;

    return (
      <>
      {!hasPassword && !isLoadingHasPassword && (
          <div className="-mt-4 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You don't have a password set yet. 
              <Link href="/forget-password" className="ml-1 font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                Set a password now
              </Link>
            </p>
          </div>
        )}
        <SettingsCard
          header="Account access"
          items={{
            "Update email": {
              label: loading ? "Loading..." : email,
              link: () => setActiveForm("changeEmail"),
            },
            "Change password": {
              label: isLoadingHasPassword ? "Loading..." : (hasPassword ? "" : "No password set"),
              link: () => setActiveForm("changePassword"),
            },
          }}
        />
        
        
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default SettingsSecurityTab;
