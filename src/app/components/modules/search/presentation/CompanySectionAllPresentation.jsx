import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Briefcase } from "lucide-react";
import  CompanyCardContainer  from "../container/CompanyCardContainer";

/**
 * @namespace search
 * @module search
 * @description A presentation component for displaying a section of company results.
 *
 * @param {Object} props - The props object.
 * @param {Array} props.companies - An array of company objects to display.
 * @param {boolean} props.isLoading - A flag indicating whether the data is still loading.
 * @param {boolean} props.isError - A flag indicating whether there was an error loading the data.
 * @param {Function} props.onViewMore - A callback function triggered when the "View More" button is clicked.
 *
 * @returns {JSX.Element} The rendered CompanySectionAllPresentation component.
 */
 const CompanySectionAllPresentation = ({
  companies,
  isLoading,
  isError,
  onViewMore,
}) => {

    if (isError) {
        return (
            <ResultsCard
                title="Companies"
                icon={<Briefcase className="h-4 w-4" />}
            >
                <p className="text-gray-400 text-sm">Error loading companies.</p>
            </ResultsCard>
        );
    }
  return (
    <ResultsCard
      viewMoreText={"View all company results"}
      isLoading={isLoading}
      onViewMore={onViewMore}
      title="Companies"
      icon={<Briefcase className="h-4 w-4" />}
    >
      {companies?.length > 0 ? (
        companies
          .slice(0, 3)
          .map((company, index) => (
            <CompanyCardContainer
              key={company.companyUsername || index}
              {...company}
            />
          ))
      ) : (
        <p className="text-gray-400 text-sm">No companies found.</p>
      )}
    </ResultsCard>
  );
};

export default CompanySectionAllPresentation;