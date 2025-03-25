import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import Image from "next/image";
import ExperienceCardContainer from "../container/ExperienceCardContainer";
import Container from "@/app/components/layout/Container";
import ModExperience from "../container/ModExperience";

export const ExperienceCard = ({ job, duration, isMyProfile }) => {
  return (
    <div className="flex gap-2">
      <div className="relative size-12 bg-gray-700 rounded-full">
        <Image
          src={job.image ?? "https://picsum.photos/200"}
          fill
          alt="Company Logo"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h4 className="flex gap-4 text-lg font-bold items-center">
          {job.title}{" "}
          {isMyProfile && <ModExperience experience={job} />}
        </h4>
        <p className="flex items-center">
          {job.company}
          <span className="text-xs ml-2">•</span>
          <span className="ml-2">{job.employmentType}</span>
        </p>
        <p className="text-muted flex">
          <span>
            {job.startDate.month} {job.startDate.year} - {job.endDate.month}{" "}
            {job.endDate.year}
          </span>
          <span className="ml-2">•</span>
          <span className="ml-2">{duration}</span>
        </p>
        <p className="text-muted">{job.location}</p>
        <p className="mt-2">{job.description}</p>
        <div className="flex gap-2 mt-2">
          {job.skills.map((skill, index) => (
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

export default function Experience({
  experience,
  allExperience,
  toggleAllExperience,
  isMyProfile,
}) {
  return (
    experience.length > 0 && (
      <Container className="border border-[#111] shadow-lg mt-4 p-8">
        <h3 className="flex justify-between text-2xl mb-4 font-bold">
          Experience{" "}
          {isMyProfile && <ModExperience adding />}
        </h3>
        <div className="space-y-8">
          {(!allExperience ? experience.slice(0, 3) : experience).map(
            (exp, index) => (
              <div className="space-y-8" key={index}>
                <ExperienceCardContainer job={exp} />
                {index !== experience.length - 1 && <hr />}
              </div>
            )
          )}

          {experience.length > 3 && (
            <button
              onClick={toggleAllExperience}
              className="w-full text-center p-2 hover:cursor-pointer duration-200 ease-in-out hover:bg-[#111] rounded-md font-[500]"
            >
              {allExperience ? (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronUp className="size-5 text-white" />
                  Show less
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronDown className="size-5 text-white" />
                  Show all {experience.length} experiences
                </div>
              )}
            </button>
          )}
        </div>
      </Container>
    )
  );
}
