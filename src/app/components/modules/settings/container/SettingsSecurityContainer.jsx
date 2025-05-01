import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmail } from "../../../../services/userManagement";
import SettingsSecurityTab from "../presentation/SettingsSecurityTab";
/**
 * @namespace settings
 * @module settings
 */
/**
 * SettingsSecurityContainer component is responsible for managing the state and data fetching
 * for the SettingsSecurityTab component.
 *
 * @returns {JSX.Element} The rendered SettingsSecurityContainer component.
 *
 */

const SettingsSecurityContainer = ({hasPassword}) => {
  const [activeForm, setActiveForm] = useState(null);

  const { data: data, isLoading } = useQuery({
    queryKey: ["emailSettings"],
    queryFn: getEmail,
  });
  
  return (
    <SettingsSecurityTab
      email={data?.email}
      loading={isLoading}
      activeForm={activeForm}
      setActiveForm={setActiveForm}
      hasPassword={hasPassword}
    />
  );
};

export default SettingsSecurityContainer;
