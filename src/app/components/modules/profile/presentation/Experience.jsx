import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import Image from "next/image";
import ExperienceCardContainer from "../container/ExperienceCardContainer";
import Container from "@/app/components/layout/Container";
import ModExperience from "../container/ModExperience";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders a card displaying professional experience information
 * @param {Object} props - The component props
 * @param {Object} props.job - The job information object
 * @param {string} props.job.image - URL of the company logo image
 * @param {string} props.job.title - Job title
 * @param {string} props.job.company - Company name
 * @param {string} props.job.employmentType - Type of employment
 * @param {Object} props.job.startDate - Start date of employment
 * @param {string} props.job.startDate.month - Start month
 * @param {number} props.job.startDate.year - Start year
 * @param {Object} props.job.endDate - End date of employment
 * @param {string} props.job.endDate.month - End month
 * @param {number} props.job.endDate.year - End year
 * @param {string} props.job.location - Job location
 * @param {string} props.job.description - Job description
 * @param {string[]} props.job.skills - Array of skills associated with the job
 * @param {string} props.duration - Formatted duration of employment
 * @param {boolean} props.isMyProfile - Flag indicating if the experience belongs to the current user's profile
 * @returns {JSX.Element} Experience card component
 */
export const ExperienceCard = ({ job, duration, isMyProfile }) => {
  return (
    <div className="flex gap-2">
      <div className="relative size-12 bg-gray-700 rounded-full">
        <Image
          src={
            job?.image && job?.image !== ""
              ? job?.image
              : `https://picsum.photos/seed/${job?._id}/200`
          }
          fill
          alt="Company Logo"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h4 className="flex gap-4 text-lg font-bold items-center">
          {job.title} {isMyProfile && <ModExperience experience={job} />}
        </h4>
        <p className="flex items-center">
          {job.company}
          <span className="text-xs ml-2">•</span>
          <span className="ml-2">{job?.employmentType}</span>
        </p>
        <p className="text-muted flex">
          <span>
            {job?.startDate?.month.substring(0, 3) + "."} {job?.startDate?.year}{" "}
            -{" "}
            {job?.isCurrent
              ? `${job?.endDate?.month}`
              : `${job?.endDate?.month.substring(0, 3) + "."}`}{" "}
            {job?.endDate?.year}
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

/**
 * Experience component that displays a list of professional experiences
 * @param {Object[]} experience - Array of experience objects to display
 * @param {boolean} allExperience - Flag to show all experiences or just first 3
 * @param {Function} toggleAllExperience - Function to toggle between showing all/less experiences
 * @param {boolean} isMyProfile - Flag to determine if viewing user's own profile
 * @returns {JSX.Element|null} Returns Experience container component if experiences exist, null otherwise
 */
export default function Experience({
  experience,
  allExperience,
  toggleAllExperience,
  isMyProfile,
}) {
  return (
    (experience?.length > 0 || isMyProfile) && (
      <Container className="border border-[#111] shadow-lg mt-4 p-8">
        <h3 className="flex justify-between text-2xl mb-4 font-bold">
          Experience {isMyProfile && <ModExperience adding />}
        </h3>
        {isMyProfile && experience?.length === 0 && (
          <div className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center">
            <p>Add your work experience to let others know more about you. </p>
          </div>
        )}
        <div className="space-y-8">
          {(!allExperience ? experience.slice(0, 3) : experience).map(
            (exp, index) => (
              <div className="space-y-8" key={index}>
                <ExperienceCardContainer job={exp} />
                {index !== experience.length - 1 && <hr />}
              </div>
            )
          )}

          {experience?.length > 3 && (
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
