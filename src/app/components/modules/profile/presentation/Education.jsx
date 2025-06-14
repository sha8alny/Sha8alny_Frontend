import Container from "@/app/components/layout/Container";
import { ChevronDown, ChevronUp, Edit, Plus } from "lucide-react";
import Image from "next/image";
import ModEducation from "../container/ModEducation";
import AddButton from "@/app/components/ui/AddButton";
import { Separator } from "@/app/components/ui/Separator";
import { School } from "@mui/icons-material";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that renders an education card displaying educational details.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.placeOfEducation - The education details object
 * @param {string} props.placeOfEducation.image - URL of the institution's logo image
 * @param {string} props.placeOfEducation.school - Name of the educational institution
 * @param {string} props.placeOfEducation.degree - Type of degree obtained
 * @param {string} props.placeOfEducation.fieldOfStudy - Field or major of study
 * @param {Object} props.placeOfEducation.startDate - Start date of education
 * @param {string} props.placeOfEducation.startDate.month - Start month
 * @param {string} props.placeOfEducation.startDate.year - Start year
 * @param {Object} props.placeOfEducation.endDate - End date of education
 * @param {string} props.placeOfEducation.endDate.month - End month
 * @param {string} props.placeOfEducation.endDate.year - End year
 * @param {string} [props.placeOfEducation.grade] - Grade achieved (optional)
 * @param {string} props.placeOfEducation.location - Location of the institution
 * @param {string} props.placeOfEducation.description - Description of the education
 * @param {string} [props.placeOfEducation.activities] - Activities and societies involved in (optional)
 * @param {string[]} props.placeOfEducation.skills - Array of skills acquired
 * @param {boolean} props.isMyProfile - Flag indicating if the card is being viewed on user's own profile
 * @returns {JSX.Element} A card component displaying education information
 */
const EducationCard = ({ placeOfEducation, isMyProfile }) => {
  const educationId =
    placeOfEducation?._id || placeOfEducation?.school?.replace(/\s+/g, "-"); // Use ID or fallback to school name for testid
  return (
    <div className="flex gap-2" data-testid={`education-card-${educationId}`}>
      {" "}
      {/* Added data-testid */}
      <div
        className="flex justify-center items-center size-12 bg-secondary/20 rounded-full"
        data-testid={`education-icon-container-${educationId}`}
      >
        {" "}
        {/* Added data-testid */}
        <School
          sx={{ fontSize: "2rem" }}
          className="text-secondary"
          data-testid={`education-icon-${educationId}`}
        />{" "}
        {/* Added data-testid */}
      </div>
      <div className="flex flex-col">
        <div
          className="flex gap-4 text-lg font-bold items-center"
          data-testid={`education-school-heading-${educationId}`}
        >
          {" "}
          {/* Added data-testid */}
          {placeOfEducation.school}{" "}
          {isMyProfile && <ModEducation education={placeOfEducation} />}{" "}
          {/* Consider adding testid inside ModEducation */}
        </div>
        <p
          className="flex items-center"
          data-testid={`education-degree-field-${educationId}`}
        >
          {" "}
          {/* Added data-testid */}
          {placeOfEducation?.degree}
          <span className="text-xs ml-2">•</span>
          <span className="ml-2">{placeOfEducation?.fieldOfStudy}</span>
        </p>
        <p
          className="text-muted flex"
          data-testid={`education-dates-${educationId}`}
        >
          {" "}
          {/* Added data-testid */}
          <span>
            {placeOfEducation?.startDate?.month?.substring(0, 3) + "."}{" "}
            {placeOfEducation?.startDate?.year} -{" "}
            {placeOfEducation?.endDate?.month?.substring(0, 3) + "."}{" "}
            {placeOfEducation?.endDate?.year}
          </span>
        </p>
        {placeOfEducation.grade && (
          <p
            className="text-muted"
            data-testid={`education-grade-${educationId}`}
          >
            {" "}
            {/* Added data-testid */}
            Grade: {placeOfEducation.grade}
          </p>
        )}
        <p
          className="text-muted"
          data-testid={`education-location-${educationId}`}
        >
          {placeOfEducation.location}
        </p>{" "}
        {/* Added data-testid */}
        <p
          className="mt-2"
          data-testid={`education-description-${educationId}`}
        >
          {placeOfEducation.description}
        </p>{" "}
        {/* Added data-testid */}
        {placeOfEducation.activities && (
          <>
            <p
              className="mt-2 font-semibold"
              data-testid={`education-activities-heading-${educationId}`}
            >
              Activities and Societies:
            </p>{" "}
            {/* Added data-testid */}
            <p
              className="text-muted"
              data-testid={`education-activities-text-${educationId}`}
            >
              {placeOfEducation.activities}
            </p>{" "}
            {/* Added data-testid */}
          </>
        )}
        <div
          className="flex gap-2 mt-2"
          data-testid={`education-skills-container-${educationId}`}
        >
          {" "}
          {/* Added data-testid */}
          {placeOfEducation.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-secondary text-background px-2 py-1 rounded-full text-xs font-bold"
              data-testid={`education-skill-${educationId}-${index}`} // Added data-testid
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
 * Education component displays a list of educational institutions/places.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.education - Array of education entries to display
 * @param {boolean} props.allEducation - Flag to show all education entries or just the first one
 * @param {Function} props.toggleAllEducation - Function to toggle between showing all/less education entries
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to current user
 *
 * @returns {JSX.Element|null} Returns education section if education array is not empty, null otherwise
 *
 * @example
 * <Education
 *   education={educationData}
 *   allEducation={showAll}
 *   toggleAllEducation={handleToggle}
 *   isMyProfile={true}
 * />
 */
export default function Education({
  education,
  allEducation,
  toggleAllEducation,
  isMyProfile,
}) {
  return (
    (isMyProfile || education?.length > 0) && (
      <Container
        className="border dark:border-[#111] shadow-lg mt-4 p-8"
        data-testid="education-section-container"
      >
        {" "}
        {/* Added data-testid */}
        <div
          className="flex justify-between text-2xl mb-4 font-bold"
          data-testid="education-section-heading"
        >
          {" "}
          {/* Added data-testid */}
          Education {isMyProfile && <ModEducation adding={true} />}{" "}
          {/* Consider adding testid inside ModEducation */}
        </div>
        <div className="space-y-8" data-testid="education-list">
          {" "}
          {/* Added data-testid */}
          {(!allEducation ? education.slice(0, 3) : education).map(
            (edu, index) => (
              <div
                className="space-y-8"
                key={edu?._id || index}
                data-testid={`education-item-${edu?._id || index}`}
              >
                {" "}
                {/* Added data-testid */}
                <EducationCard
                  placeOfEducation={edu}
                  isMyProfile={isMyProfile}
                />
                {index !== education.length - 1 && <Separator />}
              </div>
            )
          )}
          {education?.length === 0 && isMyProfile && (
            <div
              className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center"
              data-testid="education-placeholder"
            >
              {" "}
              {/* Added data-testid */}
              <p>Add your education to let others know more about you. </p>
            </div>
          )}
          {education?.length > 3 && (
            <button
              onClick={toggleAllEducation}
              className="w-full text-center hover:cursor-pointer p-2 duration-200 ease-in-out hover:bg-primary/20 rounded-md font-[500]"
              data-testid="toggle-education-button" // Added data-testid
            >
              {allEducation ? (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronUp className="size-5 text-primary" />
                  Show less
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center">
                  <ChevronDown className="size-5 text-primary" />
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
