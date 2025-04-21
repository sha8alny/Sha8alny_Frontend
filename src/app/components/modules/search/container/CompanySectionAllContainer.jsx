"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { searchCompany } from "@/app/services/search";
import  CompanySectionAllPresentation  from "../presentation/CompanySectionAllPresentation";

/**
 * @namespace search
 * @module search
 * 
 * @description
 * The `CompanySectionAllContainer` component is a container component responsible for fetching
 * and managing the state of company search results. It utilizes the `useQuery` hook to fetch
 * data from the `searchCompany` function and passes the results to the presentation component
 * `CompanySectionAllPresentation`. It also handles navigation to the companies search page.
 * 
 * @param {Object} query - The query object containing search parameters.
 * @param {string} query.query - The search query string used to fetch companies.
 * 
 * @returns {JSX.Element} The rendered `CompanySectionAllPresentation` component with the fetched data.
 */
 const CompanySectionAllContainer = ({query}) => {
  const {
    data: companies,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchCompanies", query],
    queryFn: () => searchCompany(query, 1),
  });

  const router = useRouter();
  const handleViewMore = () => {
    router.push("/search/results?keyword=" + query + "&type=company");
  };

  return (
    <CompanySectionAllPresentation
      companies={companies}
      isLoading={isLoading}
      isError={isError}
      error={error?.message}
      onViewMore={handleViewMore}
    />
  );
};

export default CompanySectionAllContainer;