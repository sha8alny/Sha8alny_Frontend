import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmail } from "../../../../services/userMangment";
import SettingsSecurityTab from "../presentation/SettingsSecurityTab";
/**
 * SettingsSecurityContainer component is responsible for managing the state and data fetching
 * for the SettingsSecurityTab component.
 *
 * @returns {JSX.Element} The rendered SettingsSecurityContainer component.
 *
 */

const SettingsSecurityContainer = () => {
  const [activeForm, setActiveForm] = useState(null);

  const { data: data, isLoading } = useQuery({
    queryKey: ["email-settings"],
    queryFn: getEmail,
  });
  
  return (
    <SettingsSecurityTab
      email={data?.email}
      loading={isLoading}
      activeForm={activeForm}
      setActiveForm={setActiveForm}
    />
  );
};

export default SettingsSecurityContainer;
