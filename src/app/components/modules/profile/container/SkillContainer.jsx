import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { SkillCard } from "../presentation/Skills";
import { use } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import { useParams } from 'next/navigation';

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
  if (endorsements === 0) {
    return 0;
  } else if (endorsements < 10) {
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
 * @param {number} props.skill.endorsementsCount - Number of endorsements for the skill
 * @param {string} props.skill.skillName - Unique identifier for the skill
 * 
 * @returns {JSX.Element} A SkillCard component with skill information and endorsement functionality
 * 
 * @example
 * <SkillContainer skill={{ id: 1, endorsementsCount: 5 }} />
 */
export default function SkillContainer({ skill }) {
  const { isMyProfile } = useIsMyProfile();
  const useUpdate = useUpdateProfile();
  const level = {
    level: determineLevel(skill.endorsementsCount),
    width: determineWidth(skill.endorsementsCount),
  };
  const params = useParams();
  const user = params?.username;
  const handleEndorsement = (skillName, username = user) => {
    useUpdate.mutate({
      api: "profile/endorse-skill",
      method: "POST",
      data: { username: username, skill: skillName },
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
