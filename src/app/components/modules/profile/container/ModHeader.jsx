/**
 * @namespace profile
 * @module profile
 */
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ModHeaderPresentation from "../presentation/ModHeaderPresentation";
import { connectUser } from "@/app/services/connectUser";
import { updateProfile } from "@/app/services/updateProfile";
import { fetchUserProfile } from "@/app/services/userProfile";

export default function ModHeader() {
  const { isMyProfile } = useIsMyProfile();

  // TODO: Implement the following functions
  const handleResumeDownload = (username) => {
    console.log("Download Resume");
  };
  
  const handleConnect = (username) => {
    connectUser(username);
    fetchUserProfile(username);
  };

  return (
    <ModHeaderPresentation
      isMyProfile={isMyProfile}
      handleConnect={handleConnect}
      handleResumeDownload={handleResumeDownload}
    />
  );
}
