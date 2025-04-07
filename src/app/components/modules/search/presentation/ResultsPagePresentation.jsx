"use client";

import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Input } from "@/app/components/ui/Input";
import { Briefcase, User, FileText } from "lucide-react";
import CompanyCardContainer from "@/app/components/modules/search/container/CompanyCardContainer";
import PersonCardContainer from "@/app/components/modules/search/container/PersonCardContainer";
/**
 * @namespace search
 * @module search
 *
 * @function ResultsPagePresentation
 * @description A presentation component for displaying search results with optional filters and pagination.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {"company"|"user"|"post"} props.type - The type of results to display (e.g., "company", "user", or "post").
 * @param {string} props.keyword - The search keyword used to filter results.
 * @param {Array} props.results - The array of search results to display.
 * @param {boolean} props.isLoading - Indicates whether the results are currently loading.
 * @param {boolean} props.isError - Indicates whether there was an error loading the results.
 * @param {number} props.currentPage - The current page number in the pagination.
 * @param {boolean} props.showNext - Indicates whether the "Next" button should be enabled.
 * @param {boolean} props.showPrev - Indicates whether the "Previous" button should be enabled.
 * @param {function} props.onPageChange - Callback function to handle page changes. Accepts a number (-1 for previous, 1 for next).
 * @param {string} [props.nameFilter] - The filter value for the "Name" field (used when `type` is "user").
 * @param {string} [props.companyFilter] - The filter value for the "Company" field (used when `type` is "user").
 * @param {string} [props.industryFilter] - The filter value for the "Industry" field (used when `type` is "user").
 * @param {function} [props.setNameFilter] - Callback function to update the "Name" filter value.
 * @param {function} [props.setCompanyFilter] - Callback function to update the "Company" filter value.
 * @param {function} [props.setIndustryFilter] - Callback function to update the "Industry" filter value.
 *
 * @returns {JSX.Element} The rendered component.
 */
const iconMap = {
  company: <Briefcase className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  post: <FileText className="h-4 w-4" />,
};

const ResultsPagePresentation = ({
  type,
  keyword,
  results,
  isLoading,
  isError,
  currentPage,
  showNext,
  showPrev,
  onPageChange,
  nameFilter,
  companyFilter,
  industryFilter,
  setNameFilter,
  setCompanyFilter,
  setIndustryFilter,
}) => {
  return (
    <div className="max-w-4xl mx-auto text-text px-4 py-6 space-y-4">
      {type === "user" && (
        <div className="bg-background p-4 rounded-lg shadow border space-y-2">
          <h3 className="text-md font-semibold">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <Input
              placeholder="Company"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
            <Input
              placeholder="Industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            />
          </div>
        </div>
      )}

      <ResultsCard
        title={`Results for "${keyword}"`}
        icon={iconMap[type]}
        isLoading={isLoading}
      >
        {isError && (
          <p className="text-gray-400 text-sm">Error loading results.</p>
        )}

        {results?.length > 0 ? (
          <>
            {results.map((item, index) => {
              if (type === "company") {
                return (
                  <CompanyCardContainer
                    key={item.companyUsername || index}
                    {...item}
                  />
                );
              }
              if (type === "user") {
                return (
                  <PersonCardContainer
                    key={item.id || index}
                    username={item.username}
                    name={item.name}
                    position={item.position}
                    company={item.company}
                    headline={item.headline}
                    about={item.about}
                    location={item.location}
                    onConnect={() => console.log(`Connect with ${item.name}`)}
                  />
                );
              }
              if (type === "post") {
                return (
                  <div
                    key={item.id || index}
                    className="p-4 border-t dark:border-gray-500"
                  >
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.excerpt || item.content?.slice(0, 100)}...
                    </p>
                  </div>
                );
              }
            })}
          </>
        ) : (
          !isLoading && (
            <p className="text-gray-400 text-sm">No results found.</p>
          )
        )}
      </ResultsCard>

      <div className="p-4 border-border bg-background flex justify-between items-center">
        <button
          className={`text-secondary p-2 rounded-md ${
            !showPrev ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={!showPrev}
          onClick={() => onPageChange(-1)}
        >
          Previous
        </button>
        <span className="text-sm text-text">Page {currentPage}</span>
        <button
          className={`text-secondary p-2 rounded-md ${
            !showNext ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => onPageChange(1)}
          disabled={!showNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsPagePresentation;
