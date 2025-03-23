import Container from "@/app/components/layout/Container";
import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import Image from "next/image";
import ModEducation from "../container/ModEducation";
import AddButton from "@/app/components/ui/AddButton";

const EducationCard = ({ placeOfEducation, isMyProfile }) => {
  return (
    <div className="flex gap-2">
      <div className="relative size-12 bg-gray-700 rounded-full">
        <Image
          src={placeOfEducation.schoolLogo ?? "https://picsum.photos/200"}
          fill
          alt="Company Logo"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-4 text-lg font-bold items-center">
          {placeOfEducation.school}{" "}
          {isMyProfile && <ModEducation education={placeOfEducation}/>}
        </div>
        <p className="flex items-center">
          {placeOfEducation.degree}
          <span className="text-xs ml-2">•</span>
          <span className="ml-2">{placeOfEducation.fieldOfStudy}</span>
        </p>
        <p className="text-muted flex">
          <span>
            {placeOfEducation.startDate.month} {placeOfEducation.startDate.year}{" "}
            - {placeOfEducation.endDate.month} {placeOfEducation.endDate.year}
          </span>
        </p>
        <p className="text-muted">
          {placeOfEducation.grade ? `Grade: ${placeOfEducation.grade}` : ""}
        </p>
        <p className="text-muted">{placeOfEducation.location}</p>
        <p className="mt-2">{placeOfEducation.description}</p>
        {placeOfEducation.activities && (
          <>
            <p className="mt-2 font-semibold">Activities and Societies:</p>
            <p className="text-muted">{placeOfEducation.activities}</p>
          </>
        )}
        <div className="flex gap-2 mt-2">
          {placeOfEducation.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-secondary text-background px-2 py-1 rounded-full text-xs font-bold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Education({
  education,
  allEducation,
  toggleAllEducation,
  isMyProfile,
}) {
  return (
    education.length > 0 && (
      <Container className="border border-[#111] shadow-lg mt-4 p-8">
        <div className="flex justify-between text-2xl mb-4 font-bold">
          Education{" "}
          {isMyProfile && <ModEducation adding={true}/>}
        </div>
        <div className="space-y-8">
          {(!allEducation ? education.slice(0, 1) : education).map(
            (edu, index) => (
              <div className="space-y-8" key={index}>
                <EducationCard placeOfEducation={edu} isMyProfile={isMyProfile} />
                {index !== education.length - 1 && <hr />}
              </div>
            )
          )}

          {education.length > 1 && (
            <button
              onClick={toggleAllEducation}
              className="w-full text-center hover:cursor-pointer p-2 duration-200 ease-in-out hover:bg-[#111] rounded-md font-[500]"
            >
              {allEducation ? (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronUp className="size-5 text-white" />
                  Show less
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronDown className="size-5 text-white" />
                  Show all {education.length} places of education
                </div>
              )}
            </button>
          )}
        </div>
      </Container>
    )
  );
}
