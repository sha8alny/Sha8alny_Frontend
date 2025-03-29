import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { SkillCard } from "../presentation/Skills";
import { use } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Determine the level of the skill
 * @param {number} endorsements  - The number of endorsements
 * @returns {string} - The level of the skill
 */
const determineLevel = (endorsements) => {
  if (endorsements < 10) {
    return "Beginner";
  } else if (endorsements < 20) {
    return "Intermediate";
  } else if (endorsements < 30) {
    return "Advanced";
  }
  return "Expert";
};

/**
 * Determine the width of the progress bar
 * @param {number} endorsements  - The number of endorsements
 * @returns {number} - The width of the progress bar
 */
const determineWidth = (endorsements) => {
  if (endorsements < 10) {
    return 25;
  } else if (endorsements < 20) {
    return 50;
  } else if (endorsements < 30) {
    return 75;
  }
  return 100;
};

/**
 * A container component for displaying and managing a skill item
 * 
 * @param {Object} props
 * @param {Object} props.skill - The skill object containing skill details
 * @param {number} props.skill.endorsements_count - Number of endorsements for the skill
 * @param {string|number} props.skill.id - Unique identifier for the skill
 * 
 * @returns {JSX.Element} A SkillCard component with skill information and endorsement functionality
 * 
 * @example
 * <SkillContainer skill={{ id: 1, endorsements_count: 5 }} />
 */
export default function SkillContainer({ skill }) {
  const { isMyProfile } = useIsMyProfile();
  const useUpdate = useUpdateProfile();
  const level = {
    level: determineLevel(skill.endorsements_count),
    width: determineWidth(skill.endorsements_count),
  };
  const handleEndorsement = (skillId) => {
    useUpdate.mutate({
      api: "endorse-skill",
      method: "POST",
      data: { skill_id: skillId },
    });
  };
  return (
    <SkillCard
      skill={skill}
      level={level}
      isMyProfile={isMyProfile}
      handleEndorsement={handleEndorsement}
    />
  );
}
