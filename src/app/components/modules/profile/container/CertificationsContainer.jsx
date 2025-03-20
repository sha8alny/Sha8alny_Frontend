import { useState } from "react";
import Certifications from "../presentation/Certifications";

export default function CertificationsContainer({ certifications }) {
  const [allCertificates, setAllCertificates] = useState(false);
  const toggleAllCertificates = () => setAllCertificates(!allCertificates);
  return (
    <Certifications
      certifications={certifications}
      allCertificates={allCertificates}
      toggleAllCertificates={toggleAllCertificates}
    />
  );
}