"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCompany, searchUser } from "@/app/services/search";
import ResultsPagePresentation from "@/app/components/modules/search/presentation/ResultsPagePresentation";
/**
 * @namespace search
 * @module search
 * 
 * @description
 * The `ResultsPageContainer` component is responsible for managing the state and logic
 * for the search results page. It fetches search results based on the provided query
 * parameters and passes the data and handlers to the presentation component.
 * 
 * @component
 * 
 * @prop {string} type - The type of search being performed (e.g., "company", "user", "post").
 * @prop {string} keyword - The search keyword used to filter results.
 * @prop {Array} results - The search results fetched from the API.
 * @prop {boolean} isLoading - Indicates whether the search results are currently being loaded.
 * @prop {boolean} isError - Indicates whether there was an error fetching the search results.
 * @prop {number} currentPage - The current page number of the search results.
 * @prop {boolean} showNext - Indicates whether the "Next" button should be displayed.
 * @prop {boolean} showPrev - Indicates whether the "Previous" button should be displayed.
 * @prop {function} onPageChange - Handler function to change the current page.
 * @prop {string} nameFilter - Filter for the name field in the search results.
 * @prop {string} companyFilter - Filter for the company field in the search results.
 * @prop {string} industryFilter - Filter for the industry field in the search results.
 * @prop {function} setNameFilter - Function to update the `nameFilter` state.
 * @prop {function} setCompanyFilter - Function to update the `companyFilter` state.
 * @prop {function} setIndustryFilter - Function to update the `industryFilter` state.
 */
const ResultsPageContainer = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "company";
  const [currentPage, setCurrentPage] = useState(1);

  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, type]);

  const queryFn = () => {
    if (type === "user") {
      return searchUser(keyword, industryFilter, companyFilter, currentPage);
    } else if (type === "post") {
      return searchPost(keyword, currentPage);
    } else {
      return searchCompany(keyword, currentPage);
    }
  };

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "search",
      type,
      keyword,
      currentPage,
      nameFilter,
      companyFilter,
      industryFilter,
    ],
    queryFn,
    enabled: !!keyword,
    keepPreviousData: true,
  });

  const showNext = results?.length === 10;
  const showPrev = currentPage > 1;

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => prev + direction);
  };

  return (
    <ResultsPagePresentation
      type={type}
      keyword={keyword}
      results={results}
      isLoading={isLoading}
      isError={isError}
      currentPage={currentPage}
      showNext={showNext}
      showPrev={showPrev}
      onPageChange={handlePageChange}
      nameFilter={nameFilter}
      companyFilter={companyFilter}
      industryFilter={industryFilter}
      setNameFilter={setNameFilter}
      setCompanyFilter={setCompanyFilter}
      setIndustryFilter={setIndustryFilter}
    />
  );
};

export default ResultsPageContainer;