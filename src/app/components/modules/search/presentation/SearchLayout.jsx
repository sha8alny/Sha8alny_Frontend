/**
 * @namespace search
 * @module search
 * 
 * @description
 * The `SearchLayout` component is a layout component designed to structure a search page.
 * It divides the page into two main sections: a sidebar and a content area.
 * The layout is responsive, with a single-column layout on smaller screens and a 
 * multi-column layout on larger screens.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.sidebar - The content to be displayed in the sidebar section.
 * @param {React.ReactNode} props.content - The content to be displayed in the main content area.
 * 
 * @returns {JSX.Element} The rendered `SearchLayout` component.
 */

 function SearchLayout({ sidebar, content }) {
  return (
    <main className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 font-sans">
      <div className="md:col-span-1 ">
        {sidebar}  
      </div>
      <div className="md:col-span-4 space-y-4 font-sans">{content}</div>
    </main>
  );
}

export default SearchLayout;