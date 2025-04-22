import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CompanyCardContainer from "../container/CompanyCardContainer";

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
  error,
}) => {
  if (isError) {
    return (
      <ResultsCard
        title="Companies"
        icon={<ApartmentIcon sx={{ fontSize: "1.125rem" }} />}
        data-testid="companies-error-card"
      >
        <p className="text-gray-400 text-sm">{error}</p>
      </ResultsCard>
    );
  }
  return (
    <ResultsCard
      viewMoreText={"View all company results"}
      isLoading={isLoading}
      onViewMore={onViewMore}
      title="Companies"
      flag={companies?.length > 0}
      icon={<ApartmentIcon sx={{ fontSize: "1.125rem" }} />}
      data-testid="companies-results-card"
    >
      {companies?.length > 0 ? (
        companies
          .slice(0, 3)
          .map((company, index) => (
            <CompanyCardContainer
              key={company.companyId || index}
              {...company}
              data-testid={`company-card-${company.companyId || index}`}
            />
          ))
      ) : (
        <p className="text-gray-400 text-sm">No companies found.</p>
      )}
    </ResultsCard>
  );
};

export default CompanySectionAllPresentation;
