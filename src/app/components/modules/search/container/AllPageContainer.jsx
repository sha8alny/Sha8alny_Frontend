// AllPageContainer.jsx
"use client";
import { useEffect, useState, useRef } from "react";
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

  const isScrolling = useRef(false);

  const sections = [
    { id: "people", label: "People" },
    { id: "companies", label: "Companies" },
    { id: "jobs", label: "Jobs" },
    { id: "posts", label: "Posts" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollPosition = window.scrollY + 100;

      let currentSection = null;

      for (const { id } of sections) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScrollHandler);

    handleScroll();

    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [activeSection, sections]);

  const handleSetActiveSection = (sectionId) => {
    isScrolling.current = true;
    setActiveSection(sectionId);

    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  return (
    <AllPagePresentation
      activeSection={activeSection}
      sections={sections}
      setActiveSection={handleSetActiveSection}
      query={query}
    />
  );
}

export default AllPageContainer;
