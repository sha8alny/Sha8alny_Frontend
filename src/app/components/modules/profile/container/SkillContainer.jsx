import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { SkillCard } from "../presentation/Skills";
import { use } from "react";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

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
