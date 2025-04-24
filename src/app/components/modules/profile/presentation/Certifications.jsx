import Container from "@/app/components/layout/Container";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import ModCertificate from "../container/ModCertificate";
import { Separator } from "@/app/components/ui/Separator";
import { WorkspacePremium } from "@mui/icons-material";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that displays a certificate card with organization logo, certificate details, and associated skills
 * @param {Object} props - The component props
 * @param {Object} props.certificate - The certificate object containing details
 * @param {string} props.certificate.name - Name of the certificate
 * @param {string} props.certificate.issuingOrganisationLogo - URL of the issuing organization's logo
 * @param {string} props.certificate.issuingOrganization - Name of the issuing organization
 * @param {Object} props.certificate.issueDate - Issue date object
 * @param {string} props.certificate.issueDate.month - Month of issue
 * @param {number} props.certificate.issueDate.year - Year of issue
 * @param {Object} props.certificate.expirationDate - Expiration date object
 * @param {string} props.certificate.expirationDate.month - Month of expiration
 * @param {number} props.certificate.expirationDate.year - Year of expiration
 * @param {string[]} props.certificate.skills - Array of skills associated with the certificate
 * @param {boolean} props.isMyProfile - Flag indicating if the certificate belongs to the current user's profile
 * @returns {JSX.Element} Certificate card component
 */
const CertificateCard = ({ certificate, isMyProfile }) => {
  return (
    <div
      className="flex gap-2"
      data-testid={`certificate-card-${certificate?.name?.replace(
        /\s+/g,
        "-"
      )}`}
    >
      <div
        className="flex justify-center items-center size-12 bg-secondary/20 rounded-full"
        data-testid="certificate-icon-container"
      >
        <WorkspacePremium
          sx={{ fontSize: "2rem" }}
          className="text-secondary"
          data-testid="certificate-icon"
        />
      </div>
      <div className="flex flex-col">
        <h4
          className="flex gap-4 text-lg font-bold items-center"
          data-testid="certificate-name-heading"
        >
          <span
            onClick={() => certificate?.certificateUrl && window.open(certificate?.certificateUrl, '_blank')}
            className={certificate?.certificateUrl ? "hover:underline cursor-pointer" : ""}
            data-testid="certificate-name"
          >
            {certificate?.name}
          </span>{" "}
          {isMyProfile && <ModCertificate certificate={certificate} />}
        </h4>
        <p data-testid="certificate-organization">
          {certificate?.issuingOrganization}
        </p>
        <p className="text-muted flex" data-testid="certificate-dates">
          <span>
            Issued {certificate?.issueDate?.month?.substring(0, 3) + "."}{" "}
            {certificate?.issueDate?.year}
            {certificate?.expirationDate &&
              ` - Expires ${
                certificate?.expirationDate?.month?.substring(0, 3) + "."
              } ${certificate?.expirationDate?.year}`}
          </span>
        </p>
        <div
          className="flex gap-2 mt-2"
          data-testid="certificate-skills-container"
        >
          {certificate?.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-secondary text-background px-2 py-1 rounded-full text-xs font-bold"
              data-testid={`certificate-skill-${index}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a section displaying user certifications with show more/less functionality
 * @param {Object[]} certifications - Array of certification objects to display
 * @param {boolean} allCertificates - Toggle flag to show all or limited certificates
 * @param {Function} toggleAllCertificates - Handler function to toggle showing all/less certificates
 * @param {boolean} isMyProfile - Flag indicating if the profile belongs to current user
 * @returns {JSX.Element|null} Returns the certificates section if there are certificates, null otherwise
 */
export default function Certifications({
  certifications,
  allCertificates,
  toggleAllCertificates,
  isMyProfile,
}) {
  return (
    (certifications?.length > 0 || isMyProfile) && (
      <Container
        className="border dark:border-[#111] rounded-xl shadow-lg mt-4 p-8"
        data-testid="certifications-section-container"
      >
        <h3
          className="flex justify-between text-2xl mb-4 font-bold"
          data-testid="certifications-section-heading"
        >
          Certificates {isMyProfile && <ModCertificate adding />}
        </h3>
        <div className="space-y-8" data-testid="certifications-list">
          {(!allCertificates
            ? certifications?.slice(0, 3)
            : certifications
          ).map((exp, index) => (
            <div
              className="space-y-8"
              key={index}
              data-testid={`certification-item-${index}`}
            >
              <CertificateCard certificate={exp} isMyProfile={isMyProfile} />
              {index !== certifications?.length - 1 && <Separator />}
            </div>
          ))}
          {isMyProfile && certifications?.length === 0 && (
            <div
              className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center"
              data-testid="certifications-placeholder"
            >
              <p>Add your certifications to let others know more about you. </p>
            </div>
          )}

          {certifications?.length > 3 && (
            <button
              onClick={toggleAllCertificates}
              className="w-full text-center p-2 hover:cursor-pointer duration-200 ease-in-out hover:bg-[#111] rounded-md font-[500]"
              data-testid="toggle-certificates-button"
            >
              {allCertificates ? (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronUp className="size-5" />
                  Show less
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronDown className="size-5" />
                  Show all {certifications?.length} certifications
                </div>
              )}
            </button>
          )}
        </div>
      </Container>
    )
  );
}
