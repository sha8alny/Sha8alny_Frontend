import { Plus, ThumbsUp, Loader2 } from "lucide-react"; // Import Loader2
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
 * @param {Function} props.handleUnendorsement - Callback function to handle skill unendorsement
 * @param {boolean} props.isEndorsing - Flag indicating if an endorsement action is in progress
 * @returns {JSX.Element} A skill card component with name, level, progress bar and endorsement button
 */
export const SkillCard = ({
  skill,
  level,
  isMyProfile,
  handleEndorsement,
  handleUnendorsement,
  isEndorsing,
}) => {
  const skillTestId = skill?.skillName?.replace(/\s+/g, "-") || "unknown-skill";
  return (
    <div className="space-y-2" data-testid={`skill-card-${skillTestId}`}>
      <div className="flex items-center justify-between">
        <h3
          className="font-semibold truncate"
          data-testid={`skill-name-${skillTestId}`}
        >
          {skill?.skillName}
        </h3>
        <span
          className="text-xs font-medium text-background bg-secondary px-2 py-0.5 rounded-full"
          data-testid={`skill-level-${skillTestId}`}
        >
          {level.level}
        </span>
      </div>
      <div
        className="h-2 bg-gray-300 rounded-full dark:bg-gray-800"
        data-testid={`skill-progress-bar-container-${skillTestId}`}
      >
        <div
          className="h-2 bg-secondary rounded-full"
          style={{ width: `${level.width}%` }}
          data-testid={`skill-progress-bar-${skillTestId}`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span data-testid={`skill-endorsements-count-${skillTestId}`}>
          {skill?.endorsementsCount ?? 0} endorsements
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={isMyProfile || isEndorsing}
          onClick={() =>
            skill.isEndorsed
              ? handleUnendorsement(skill.skillName)
              : handleEndorsement(skill.skillName)
          }
          className={`h-7 px-2 transition-colors cursor-pointer duration-150 ease-in-out flex items-center justify-center
            ${
              isEndorsing
                ? "text-muted cursor-wait"
                : isMyProfile
                ? "disabled:cursor-not-allowed"
                : skill.isEndorsed
                ? "text-secondary font-bold hover:bg-secondary/10"
                : "text-primary hover:bg-primary/10"
            }
          `}
          data-testid={`skill-endorse-button-${skillTestId}`}
        >
          {isEndorsing ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <ThumbsUp className="w-3 h-3 mr-1" />
          )}
          {isEndorsing
            ? "Processing..."
            : skill.isEndorsed
            ? "Endorsed"
            : "Endorse"}{" "}
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
      <Container
        className="border dark:border-[#111] shadow-lg p-8 mt-4"
        data-testid="skills-section-container"
      >
        <h3
          className="flex justify-between text-2xl mb-4 font-bold"
          data-testid="skills-section-title"
        >
          Skills
          {isMyProfile && (
            <ModSkill skills={skills} data-testid="skills-mod-button" />
          )}
        </h3>
        {(isMyProfile || skills?.length > 0) && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-testid="skills-grid"
          >
            {skills.map((skill, index) => (
              <SkillContainer key={index} skill={skill} />
            ))}
          </div>
        )}
        {skills?.length === 0 && isMyProfile && (
          <div
            className="w-full border-dashed rounded-2xl border-primary/30 text-muted border-2 p-4 mt-4 flex items-center justify-center"
            data-testid="skills-empty-placeholder"
          >
            <p>Add a skill to let others know more about your expertise.</p>
          </div>
        )}
      </Container>
    )
  );
}
