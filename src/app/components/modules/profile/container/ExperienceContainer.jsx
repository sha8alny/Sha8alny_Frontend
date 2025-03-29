"use client";
import { useState } from "react";
import Experience from "../presentation/Experience";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Container component for managing the Experience section in a user's profile.
 * Handles the state for toggling between showing all experiences or a limited view.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.experience - Array of experience objects to display
 * @returns {JSX.Element} Experience component with necessary props
 */
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
