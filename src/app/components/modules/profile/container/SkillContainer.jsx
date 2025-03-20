import { SkillCard } from "../presentation/Skills";

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
}

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
}

export default function SkillContainer({ skill }) {
  const level = {
    level: determineLevel(skill.endorsements_count),
    width: determineWidth(skill.endorsements_count)
  }
  return <SkillCard skill={skill} level={level}/>;
}