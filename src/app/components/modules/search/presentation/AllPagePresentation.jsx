"use client";

import { SearchLayout } from "@/app/components/modules/search/presentation/SearchLayout";
import { CompanySectionAllContainer } from "@/app/components/modules/search/container/CompanySectionAllContainer";
import PeopleSectionAllContainer  from "@/app/components/modules/search/container/PeopleSectionAllContainer";
import JobSectionAllContainer from "../container/JobSectionAllContainer";

 function AllPagePresentation({ activeSection, sections, setActiveSection, query }) {
  const SidebarContent = (
    <div className="bg-foreground text-text shadow-sm mt-4 p-3 py-4 rounded-lg sticky top-20">
      <h2 className="text-base font-medium mb-3">On this page</h2>
      <nav className="space-y-1">
        {sections.map(({ id, label }) => (
          <SidebarLink
            handler={setActiveSection}
            key={id}
            href={`#${id}`}
            active={activeSection === id}
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
        <CompanySectionAllContainer  query={query}/>
      </section>
    </div>
  );

  return <SearchLayout sidebar={SidebarContent} content={mainContent} />;
}

function SidebarLink({ href, children, active, handler }) {
  return (
    <a
      href={href}
      className={`block py-1 pl-2 text-sm ${
        active
          ? "border-l-2 border-secondary text-text font-medium"
          : "border-l-2 border-transparent text-gray-300 hover:text-text"
      }`}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", inline: "end",block: "start" });
        handler(children);
      }}
    >
      {children}
    </a>
  );
}

export default AllPagePresentation;