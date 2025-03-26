import { useState } from "react";
import Education from "../presentation/Education";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

/**
 * Container component for managing education data display.
 * Manages the state for showing all education entries and provides functionality to toggle display.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.education - Array of education data to be displayed
 * @returns {JSX.Element} Education component with proper props
 */
export default function EducationContainer({ education }) {
  const { isMyProfile } = useIsMyProfile();
  const [allEducation, setAllEducation] = useState(false);
  const toggleAllEducation = () => setAllEducation(!allEducation);
  return (
    <Education
      education={education}
      allEducation={allEducation}
      toggleAllEducation={toggleAllEducation}
      isMyProfile={isMyProfile}
    />
  );
}
