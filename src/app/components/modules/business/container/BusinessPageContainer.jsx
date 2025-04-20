
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCompanies } from "@/app/services/companyManagement";
import { useRouter } from "next/navigation";
import  BusinessPagePresentation  from "../presentation/BusinessPagePresentation";

/**
 * @namespace business
 * @module business
 * @description
 * The `BusinessPageContainer` component serves as the container component for the business page.
 * It manages the state and logic for fetching user companies, handling pagination, and navigating
 * to the company creation form. It passes the necessary data and handlers to the presentation
 * component `BusinessPagePresentation`.
 *
 * @component
 * @example
 * <BusinessPageContainer />
 *
 * @returns {JSX.Element} The rendered `BusinessPageContainer` component.
 *
 * @prop {Array} companies - The list of companies fetched from the API.
 * @prop {boolean} isLoading - Indicates whether the data is currently being loaded.
 * @prop {boolean} isError - Indicates whether there was an error during data fetching.
 * @prop {string} error - The error message, if any, encountered during data fetching.
 * @prop {number} currentPage - The current page number for pagination.
 * @prop {function} onPageChange - Callback function to handle page changes.
 * @prop {function} onCreateCompany - Callback function to navigate to the company creation form.
 */


function BusinessPageContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const {
    data: companies,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userCompanies", currentPage],
    queryFn: () => getUserCompanies(currentPage),
    retry: false,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreateCompany = () => {
    router.push("/company/setup");
  };
  
  return (
    <BusinessPagePresentation
      companies={companies}
      isLoading={isLoading}
      isError={isError}
      error={error?.message}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onCreateCompany={handleCreateCompany}
    />
  );
}

export default BusinessPageContainer;
