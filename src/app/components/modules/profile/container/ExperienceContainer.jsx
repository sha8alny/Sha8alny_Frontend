"use client";
import { useState } from "react";
import Experience from "../presentation/Experience";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

export default function ExperienceContainer({ experience }) {
  const [allExperience, setAllExperience] = useState(false);
  const toggleAllExperience = () => setAllExperience(!allExperience);
  const { isMyProfile } = useIsMyProfile();
  return (
    <Experience
      experience={experience}
      allExperience={allExperience}
      toggleAllExperience={toggleAllExperience}
      isMyProfile={isMyProfile}
    />
  );
}
