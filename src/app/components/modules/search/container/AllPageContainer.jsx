
"use client";

import { useEffect, useState } from "react";
import AllPagePresentation from "../presentation/AllPagePresentation";
import { useSearchParams } from "next/navigation";

/**
 * @namespace search
 * @module search
 */
/**
 * AllPageContainer Component
 *
 * This component serves as a container for the "All Page" functionality. It manages the active section state,
 * handles scroll-based section activation, and passes relevant props to the presentation component.
 *
 * @component
 * @returns {JSX.Element} The rendered AllPageContainer component.
 *
 * @description
 * - Tracks the active section based on scroll position.
 * - Retrieves the search query from the URL using `useSearchParams`.
 * - Passes the active section, sections list, and query to the presentation component.
 *
 */

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
