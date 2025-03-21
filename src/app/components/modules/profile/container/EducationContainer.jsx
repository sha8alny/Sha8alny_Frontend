import { useState } from "react";
import Education from "../presentation/Education";

export default function EducationContainer({ education }) {
  const [allEducation, setAllEducation] = useState(false);
  const toggleAllEducation = () => setAllEducation(!allEducation);
  return (
    <Education
      education={education}
      allEducation={allEducation}
      toggleAllEducation={toggleAllEducation}
    />
  );
}
