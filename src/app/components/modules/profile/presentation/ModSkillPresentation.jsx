import AddButton from "@/app/components/ui/AddButton";
import { Trash } from "lucide-react";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders a skill modification presentation component with search and add functionality
 * @param {Object} props - Component props
 * @param {Array} props.skills - Array of skill objects
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Function} props.updateSkill - Function to update/remove skills
 * @param {Function} props.setSearchTerm - Function to set the search term
 * @param {string} props.searchTerm - Current search term value
 * @returns {JSX.Element} Skill modification interface with search and grid display
 */
export default function ModSkillPresentation({
  skills,
  isLoading,
  updateSkill,
  setSearchTerm,
  searchTerm,
}) {
  return (
    <div className="space-y-4" data-testid="mod-skill-presentation">
      <div className="flex gap-2 justify-between items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search skills..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-foreground text-primary border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchTerm}
            data-testid="mod-skill-search-input"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <AddButton
          onClick={() => updateSkill(0, searchTerm)}
          data-testid="mod-skill-add-button"
        />
      </div>

      <div className="grid grid-cols-2 gap-3" data-testid="mod-skill-grid">
        {skills.length === 0 ? (
          <p
            className="text-center text-muted py-4 col-span-2"
            data-testid="mod-skill-no-skills"
          >
            No skills found.
          </p>
        ) : (
          skills.map((skill) => (
            <ModSkillCard
              key={skill?.skillName}
              skill={skill}
              isLoading={isLoading}
              removeSkill={updateSkill}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * A component that renders a skill card with delete functionality.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.skill - The skill object containing skill information
 * @param {string} props.skill.skillName - The name of the skill
 * @param {Function} props.removeSkill - Callback function to remove the skill
 * @param {boolean} props.isLoading - Flag indicating if the remove operation is in progress
 * @returns {JSX.Element} A card displaying the skill name with a delete button
 */
const ModSkillCard = ({ skill, removeSkill, isLoading }) => {
  const skillTestId = skill?.skillName?.replace(/\s+/g, "-") || "unknown-skill";
  return (
    <div data-testid={`mod-skill-card-${skillTestId}`}>
      <div className="flex justify-between items-center p-3 border dark:border-[#111] bg-foreground rounded-md">
        <h3
          className="font-semibold text-primary truncate"
          data-testid={`mod-skill-name-${skillTestId}`}
        >
          {skill?.skillName}
        </h3>
        <button
          onClick={() => removeSkill(2, skill?.skillName)}
          className="text-primary font-semibold p-1 rounded-md hover:bg-foreground cursor-pointer duration-250"
          disabled={isLoading}
          data-testid={`mod-skill-delete-button-${skillTestId}`}
        >
          <Trash className="size-4" />
        </button>
      </div>
    </div>
  );
};
