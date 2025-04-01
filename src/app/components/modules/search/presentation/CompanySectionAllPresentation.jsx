import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Briefcase } from "lucide-react";
import { CompanyCardContainer } from "../container/CompanyCardContainer";

export const CompanySectionAllPresentation = ({
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