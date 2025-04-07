"use client";

import CompanyCardContainer from "../container/CompanyCardContainer";

/**
 * @namespace business
 * @module business
 */

/**
 * SkeletonCard Component
 * A functional component that renders a skeleton loading card with placeholder elements.
 *
 * @function SkeletonCard
 * @returns {JSX.Element} A skeleton card with animated placeholders.
 */

/**
 * CompanyListPresentation Component
 * A functional component that displays a list of companies or appropriate messages based on the loading, error, or empty state.
 *
 * @function CompanyListPresentation
 * @param {Object} props - The props object.
 * @param {Object} props.companies - The companies data object.
 * @param {boolean} props.companies.isLoading - Indicates if the companies data is loading.
 * @param {boolean} props.companies.isError - Indicates if there was an error fetching companies data.
 * @param {string} [props.companies.error] - The error message, if any.
 * @param {Array} [props.companies.companies] - The list of company objects.
 * @param {boolean} isError - Indicates if there was an error in the parent component.
 * @param {string} error - The error message to display.
 * @returns {JSX.Element} A grid of company cards, a loading skeleton, or an error/empty state message.
 */
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-foreground shadow-sm p-6 space-y-4 animate-pulse">
      <div className="h-20 w-20 rounded-md bg-gray-300"></div>
      <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-10 w-full bg-gray-300 rounded"></div>
    </div>
  );
}

function CompanyListPresentation({ companies, isError, error }) {
  if (companies.isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (companies.isError && companies.error !== "No companies found for the given query.") {
    return (
      <div className="w-1/2 mx-auto flex flex-col text-text items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">Error</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }
  console.log(companies.companies, "companies in presentation");
  if (companies.length === 0 || companies.error === "No companies found for the given query.") {
    return (
      <div className="w-1/2 mx-auto flex flex-col text-text items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">No companies yet</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Get started by creating your first company page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {companies?.companies?.map((company) => (
        <CompanyCardContainer key={company.companyUsername} company={company} />
      ))}
    </div>
  );
}

export default CompanyListPresentation;