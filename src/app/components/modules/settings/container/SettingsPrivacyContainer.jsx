import SettingsCard from "../presentation/SettingsCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmail } from "../../../../services/userManagement";
import BlockedUsersContainer from "./BlockedUsersContainer";
/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsPrivacyContainer component is responsible for managing invitations and blocked users
 * in the settings page.
 *
 *
 * @returns {JSX.Element} The rendered SettingsPrivacyContainer component.
 *
 * */

const SettingsPrivacyContainer = () => {
  const [activeForm, setActiveForm] = useState(null);

  
  const renderContent = () => {
    if (activeForm == "Blocked users")
      return <BlockedUsersContainer toggleForm={() => setActiveForm(null)} />;
    // if (activeForm == "Invitations to connect")
    //   return <InvitationsContainer toggleForm={() => setActiveForm(null)} />;

    return (
      <SettingsCard
        header="Privacy"
        items={{
          // "Invitations to connect": {
          //   label: false ? "Loading..." : "",
          //   link: () => setActiveForm("Invitations to connect"),
          // },
          "Blocked users": {
            label: "",
            link: () => setActiveForm("Blocked users"),
          },
        }}
      />
    );
  };
  return <>{renderContent()}</>;
};

export default SettingsPrivacyContainer;
