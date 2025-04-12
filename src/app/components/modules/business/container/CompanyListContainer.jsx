
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserCompanies } from "@/app/services/companyManagement";
import CompanyListPresentation from "../presentation/CompanyListPresentation";
/**
 * @namespace business
 * @module business
 * 
 * @description
 * The `CompanyListContainer` component is a container component responsible for fetching
 * and managing the state of a list of companies. It utilizes the `react-query` library
 * to handle asynchronous data fetching and passes the data, loading, and error states
 * to the presentation component `CompanyListPresentation`.
 * 
 * @param {Array} companies - The list of companies to be displayed.
 * @param {boolean} isLoading - Indicates whether the data is currently being loaded.
 * @param {boolean} isError - Indicates whether an error occurred during data fetching.
 * @param {Error} [error] - The error object containing details about the error, if any.
 * 
 * @returns {JSX.Element} The rendered `CompanyListPresentation` component with the provided props.
 */
function CompanyListContainer(companies, isLoading, isError, error) {


  return (
    <CompanyListPresentation
      companies={companies}
      isLoading={isLoading}
      isError={isError}
      error={error?.message}
    />
  );
}

export default CompanyListContainer;