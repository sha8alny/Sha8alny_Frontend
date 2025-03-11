"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SettingsSidebar from "../components/modules/settings/presentation/SettingsSidebar";
import SettingsNavbar from "../components/modules/settings/presentation/SettingsNavbar";
import SettingsAccountPrefs from "../components/modules/settings/presentation/SettingsAccountPrefs";
import SettingsSecurityContainer from "../components/modules/settings/container/SettingsSecurityContainer";
import { fetchUserProfile } from "@/app/services/userProfile";

export default function Settings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSetting, setActiveSetting] = useState("Account Preferences");

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile("john"),
  });

  const profilePictureUrl = user?.profile_picture_url; 

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSetting(section);
    }
  }, [searchParams]);

  const handleSetActiveSetting = (setting) => {
    setActiveSetting(setting);
    router.push(`/settings?section=${encodeURIComponent(setting)}`);
  };
  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-x-hidden overflow-y-scroll">
      <SettingsNavbar profilePictureUrl={profilePictureUrl} />
      <div className="flex flex-col md:flex-row h-full">
        <SettingsSidebar 
          setActiveSetting={handleSetActiveSetting} 
          profilePictureUrl={profilePictureUrl} 
        />
        <div className="flex flex-col gap-4 p-8 rounded-lg h-full w-full">
          {activeSetting === "Account Preferences" && <SettingsAccountPrefs />}
          {activeSetting === "Sign in & Security" && <SettingsSecurityContainer />}
          {activeSetting === "Notifications" && "Notifications"}
          {activeSetting === "Privacy" && "Privacy"}
          {activeSetting === "Help" && "Help"}
        </div>
      </div>
    </div>
  );
}
