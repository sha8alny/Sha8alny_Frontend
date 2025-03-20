import Container from "@/components/layout/Container";
import AddButton from "@/components/ui/AddButton";
import EditButton from "@/components/ui/EditButton";
import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import Image from "next/image";

const CertificateCard = ({ certificate }) => {
  return (
    <div className="flex gap-2">
      <div className="relative size-12 bg-gray-700 rounded-full">
        <Image
          src={
            certificate.issuingOrganisationLogo ?? "https://picsum.photos/200"
          }
          fill
          alt="Company Logo"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h4 className="flex gap-4 text-lg font-bold items-center">
          {certificate.name}{" "}
          <EditButton/>
        </h4>
        <p>{certificate.issuingOrganization}</p>
        <p className="text-muted flex">
          <span>
            Issued {certificate.issueDate.month} {certificate.issueDate.year} -{" "}
            Expires {certificate.expirationDate.month} {certificate.expirationDate.year}
          </span>
        </p>
        <div className="flex gap-2 mt-2">
          {certificate.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-muted text-background px-2 py-1 rounded-full text-xs font-bold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Certifications({
  certifications,
  allCertificates,
  toggleAllCertificates,
}) {
  return (
    certifications.length > 0 && (
      <Container className="border border-[#111] rounded-xl shadow-lg mt-4 p-8">
        <h3 className="flex justify-between text-2xl mb-4 font-bold">
          Certificates{" "}
          <AddButton/>
        </h3>
        <div className="space-y-8">
          {(!allCertificates ? certifications.slice(0, 3) : certifications).map(
            (exp, index) => (
              <div className="space-y-8" key={index}>
                <CertificateCard certificate={exp} />
                {index !== certifications.length - 1 && <hr />}
              </div>
            )
          )}

          {certifications.length > 3 && (
            <button
              onClick={toggleAllCertificates}
              className="w-full text-center p-2 hover:cursor-pointer duration-200 ease-in-out hover:bg-[#111] rounded-md font-[500]"
            >
              {allCertificates ? (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronUp className="size-5" />
                  Show less
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronDown className="size-5" />
                  Show all {certifications.length} certifications
                </div>
              )}
            </button>
          )}
        </div>
      </Container>
    )
  );
}
