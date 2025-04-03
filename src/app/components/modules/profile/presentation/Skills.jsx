import { Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import SkillContainer from "../container/SkillContainer";
import Container from "@/app/components/layout/Container";
import ModSkill from "../container/ModSkill";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders a skill card component with endorsement functionality
 * @param {Object} props - Component props
 * @param {Object} props.skill - Skill object containing skill details
 * @param {string} props.skill.skillName - Name of the skill
 * @param {number} props.skill.id - Unique identifier for the skill
 * @param {number} props.skill.endorsementsCount - Number of endorsements for the skill
 * @param {boolean} props.skill.isEndorsed - Whether the current user has endorsed this skill
 * @param {Object} props.level - Level object containing level details
 * @param {string} props.level.level - Skill proficiency level text
 * @param {number} props.level.width - Width percentage for the progress bar
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to the current user
 * @param {Function} props.handleEndorsement - Callback function to handle skill endorsement
 * @returns {JSX.Element} A skill card component with name, level, progress bar and endorsement button
 */
export const SkillCard = ({ skill, level, isMyProfile, handleEndorsement }) => {
  return (
    <div className="space-y-2">
      <div className="flex sm:flex-row md:flex-col lg:flex-row items-center justify-between">
        <h3 className="font-semibold truncate">{skill?.skillName}</h3>
        <span className="text-xs font-medium text-background bg-secondary px-2 py-0.5 rounded-full">
          {level.level}
        </span>
      </div>
      <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-800">
        <div
          className="h-2 bg-secondary rounded-full"
          style={{ width: `${level.width}%` }}
        />
      </div>
      <div className="flex sm:flex-row md:flex-col lg:flex-row items-center justify-between text-xs text-muted">
        <span>{skill?.endorsementsCount ?? 0} endorsements</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={isMyProfile || skill.isEndorsed}
          onClick={() => handleEndorsement(skill.skillName)}
          className={`h-7 px-2 hover:bg-foreground hover:cursor-pointer ${
            skill.isEndorsed ? "text-secondary font-bold" : "text-primary"}
            ${isMyProfile ? "cursor-not-allowed" : ""}
          `}
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          Endorse{skill.isEndorsed && "d"}
        </Button>
      </div>
    </div>
  );
};

/**
 * A component that displays a grid of skills with an optional modification button
 * @component
 * @param {Object} props - The component props
 * @param {Array<Object>} props.skills - Array of skill objects to display
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to the current user
 * @returns {JSX.Element} A container with skills displayed in a responsive grid
 */
export default function Skills({ skills, isMyProfile }) {
  return (
    (skills?.length > 0 || isMyProfile) && (
    <Container className="border border-[#111] shadow-lg p-8 mt-4">
      <h3 className="flex justify-between text-2xl mb-4 font-bold">
        Skills
        {isMyProfile && <ModSkill skills={skills} />}
      </h3>
      {(isMyProfile || skills?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <SkillContainer key={index} skill={skill} />
          ))}
        </div>
      )}
      {skills?.length === 0 && isMyProfile && (
        <div className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center">
          <p>Add a skill to let others know more about your expertise.</p>
        </div>
      )}
    </Container>
    )
  );
}
