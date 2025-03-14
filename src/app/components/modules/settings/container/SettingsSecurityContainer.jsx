import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../../../services/userMangment";
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

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const profilePictureUrl = user?.profilePicture; 
  console.log(user);
  
  return (
    <SettingsSecurityTab
      user={user}
      loading={isLoading}
      activeForm={activeForm}
      setActiveForm={setActiveForm}
    />
  );
};

export default SettingsSecurityContainer;
