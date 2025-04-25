"use client";

import SearchLayout from "@/app/components/modules/search/presentation/SearchLayout";
import CompanySectionAllContainer from "@/app/components/modules/search/container/CompanySectionAllContainer";
import PeopleSectionAllContainer from "@/app/components/modules/search/container/PeopleSectionAllContainer";
import JobSectionAllContainer from "../container/JobSectionAllContainer";
import PostSectionAllContainer from "../container/PostSectionAllContainer";
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import ArticleIcon from '@mui/icons-material/Article';

/**
 * @namespace search
 * @module search
 */

/**
 * AllPagePresentation component renders the main layout for the search page, 
 * including a sidebar with navigation links and main content sections for people, 
 * companies, jobs, and posts.
 *
 * @function AllPagePresentation
 * @param {Object} props - The component props.
 * @param {string} props.activeSection - The currently active section ID.
 * @param {Array} props.sections - An array of section objects, each containing an `id` and `label`.
 * @param {Function} props.setActiveSection - A function to set the active section.
 * @param {string} props.query - The search query string.
 * @returns {JSX.Element} The rendered AllPagePresentation component.
 */

function AllPagePresentation({ activeSection, sections, setActiveSection, query }) {
  const sectionIcons = {
    people: <PeopleIcon fontSize="small" />,
    companies: <BusinessIcon fontSize="small" />,
    jobs: <WorkIcon fontSize="small" />,
    posts: <ArticleIcon fontSize="small" />
  };

  const SidebarContent = (
    <div className="bg-foreground text-text shadow-sm mt-4 p-3 py-4 rounded-lg sticky top-20">
      <h2 className="text-base font-medium mb-3">On this page</h2>
      <nav className="space-y-1">
        {sections.map(({ id, label }) => (
          <SidebarLink
            key={id}
            sectionId={id}
            href={`#${id}`}
            active={activeSection === id}
            setActiveSection={setActiveSection}
            icon={sectionIcons[id]}
            data-testid={`sidebar-link-${id}`}
          >
            {label}
          </SidebarLink>
        ))}
      </nav>
    </div>
  );

  const mainContent = (
    <div className="mt-4 flex flex-col gap-6">
      <section id="people">
        <PeopleSectionAllContainer query={query} />
      </section>
      <section id="companies">
        <CompanySectionAllContainer query={query}/>
      </section>
      <section id="jobs">
        <JobSectionAllContainer query={query} />
      </section>
      <section id="posts">
        <PostSectionAllContainer query={query}/>
      </section>
    </div>
  );

  return <SearchLayout sidebar={SidebarContent} content={mainContent} />;
}

/**
 * SidebarLink component renders a single link in the sidebar navigation.
 *
 * @function SidebarLink
 * @param {Object} props - The component props.
 * @param {string} props.href - The href attribute for the link.
 * @param {React.ReactNode} props.children - The content of the link.
 * @param {boolean} props.active - Indicates whether the link is active.
 * @param {string} props.sectionId - The ID of the section this link points to.
 * @param {Function} props.setActiveSection - A function to set the active section.
 * @param {JSX.Element} [props.icon] - The icon to display next to the text.
 * @param {string} [props.['data-testid']] - The test ID for the component.
 * @returns {JSX.Element} The rendered SidebarLink component.
 */
function SidebarLink({ href, children, active, sectionId, setActiveSection, icon, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const headerOffset = 80; 
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveSection(sectionId);
    }
  };

  return (
    <a
      href={href}
      className={`flex items-center py-1 pl-2 text-sm ${
        active
          ? "border-l-2 border-secondary text-text font-medium"
          : "border-l-2 border-transparent text-gray-300 hover:text-text"
      }`}
      onClick={handleClick}
      data-testid={props['data-testid'] || `sidebar-link-${sectionId}`}
    >
      {icon && <span className="mr-2" data-testid={`sidebar-icon-${sectionId}`}>{icon}</span>}
      {children}
    </a>
  );
}

export default AllPagePresentation;