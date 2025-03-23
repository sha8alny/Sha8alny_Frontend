import { useState } from "react";
import Education from "../presentation/Education";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";

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
