import { useState } from "react";
import Certifications from "../presentation/Certifications";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

/**
 * A container component for the Certifications component.
 * Manages state for showing all certificates and passes props to the Certifications component.
 * 
 * @param {Object} props - The component props
 * @param {Array} props.certifications - Array of certification objects to display
 * @returns {JSX.Element} Rendered Certifications component with necessary props
 */
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