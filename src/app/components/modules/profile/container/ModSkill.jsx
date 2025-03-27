import Dialog from "@/app/components/ui/DialogMod";
import ModSkillPresentation from "../presentation/ModSkillPresentation";
import { useEffect, useState } from "react";
import AddButton from "@/app/components/ui/AddButton";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that manages and modifies user skills through a dialog interface.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.skills - Array of skill objects containing skill information
 * 
 * @returns {JSX.Element} A Dialog component containing skill modification interface
 * 
 * @example
 * // Each skill object in the skills array should have this structure:
 * const skill = {
 *   skill_name: "JavaScript"
 * }
 * 
 * // Usage
 * <ModSkill skills={userSkills} />
 */
export default function ModSkill({ skills }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSkills, setFilteredSkills] = useState(skills || []);
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (!skills) return;

    if (searchTerm.trim() === "") {
      setFilteredSkills(skills);
    } else {
      const filtered = skills.filter((skill) =>
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [skills, searchTerm]);

  const updateSkill = (type, skillName) => {
    if (typeof skillName === "string") {
      if (skillName.trim().length === 0) {
        return;
      }
    }
    if (
      filteredSkills.find(
        (s) => s.skill_name.toLowerCase() === skillName.toLowerCase()
      ) &&
      type == 0
    ) {
      return;
    }
    const skillOperation = { skill_name: skillName.trim() };
    const operation = {
      api: type == 0 ? "add-skill" : type === 1 ? "edit" : "delete-skill",
      method: type == 0 ? "POST" : type === 1 ? "PATCH" : "DELETE",
      data: { ...skillOperation },
    };
    updateProfileMutation.mutate({
      ...operation,
    });
    setSearchTerm("");
  };

  return (
    <Dialog
      className="min-w-max"
      useRegularButton
      buttonData={<AddButton />}
      AlertContent={
        <ModSkillPresentation
          skills={filteredSkills}
          isLoading={updateProfileMutation.isLoading}
          setSearchTerm={setSearchTerm}
          updateSkill={updateSkill}
          searchTerm={searchTerm}
        />
      }
    />
  );
}
