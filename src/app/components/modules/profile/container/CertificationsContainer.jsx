import { useState } from "react";
import Certifications from "../presentation/Certifications";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

export default function CertificationsContainer({ certifications }) {
  const { isMyProfile } = useIsMyProfile();
  const [allCertificates, setAllCertificates] = useState(false);
  const toggleAllCertificates = () => setAllCertificates(!allCertificates);
  return (
    <Certifications
      certifications={certifications}
      allCertificates={allCertificates}
      toggleAllCertificates={toggleAllCertificates}
      isMyProfile={isMyProfile}
    />
  );
}