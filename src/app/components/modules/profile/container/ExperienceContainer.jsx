"use client";
import { useState } from "react";
import Experience from "../presentation/Experience";

export default function ExperienceContainer({ experience }) {
  const [allExperience, setAllExperience] = useState(false);
  const toggleAllExperience = () => setAllExperience(!allExperience);
  return (
    <Experience
      experience={experience}
      allExperience={allExperience}
      toggleAllExperience={toggleAllExperience}
    />
  );
}
