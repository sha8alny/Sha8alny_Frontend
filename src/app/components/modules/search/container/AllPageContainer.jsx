"use client";

import { useEffect, useState } from "react";
import AllPagePresentation from "../presentation/AllPagePresentation";
import { useSearchParams } from "next/navigation";
function AllPageContainer() {
  const [activeSection, setActiveSection] = useState("people");
  const searchParams = useSearchParams();
  let query = searchParams.get("query") || "";
  const sections = [
    { id: "people", label: "People" },
    { id: "companies", label: "Companies" },
    { id: "jobs", label: "Jobs" },
    { id: "posts", label: "Posts" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      let currentSection = activeSection;

      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, sections]);

  return (
    <AllPagePresentation
      activeSection={activeSection}
      sections={sections}
      setActiveSection={setActiveSection}
        query={query}
    />
  );
}

export default AllPageContainer;
