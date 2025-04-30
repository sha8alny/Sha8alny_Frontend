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
  const type = searchParams.get("type") || "company";
  const [currentPage, setCurrentPage] = useState(1);
  
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const keyword = nameFilter == ""? searchParams.get("keyword"): nameFilter;
  const [connectionDegree, setConnectionDegree] = useState("");
  const [companyIndustryFilter, setCompanyIndustryFilter] = useState("");
  const [orgSizeFilter, setOrgSizeFilter] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState("");
  
  const [tempName, setTempName] = useState(nameFilter);
  const [tempCompany, setTempCompany] = useState(companyFilter);
  const [tempIndustry, setTempIndustry] = useState(industryFilter);
  const [tempLocation, setTempLocation] = useState(locationFilter);
  const [tempCompanyIndustry, setTempCompanyIndustry] = useState(companyIndustryFilter);

  useEffect(() => {
    setTempName(nameFilter);
    setTempCompany(companyFilter);
    setTempIndustry(industryFilter);
    setTempLocation(locationFilter);
    setTempCompanyIndustry(companyIndustryFilter);
  }, [nameFilter, companyFilter, industryFilter, locationFilter, companyIndustryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ type]);
  
  
  const queryFn = () => {
    if (type === "user") {
      return searchUser(keyword, industryFilter, companyFilter, locationFilter, connectionDegree, currentPage, 10);
    } else if (type === "post") {
      return searchPost(keyword, currentPage);
    } else if (type == "company") {
      return searchCompany(keyword,currentPage, companyIndustryFilter, locationFilter, orgSizeFilter, orgTypeFilter, currentPage, 10);
    }
  };

  const {
    data: results,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: [
      "searchCompanies",
      "searchUsers",
      type,
      keyword,
      industryFilter,
      companyFilter,
      locationFilter,
      connectionDegree,
      companyIndustryFilter,
      orgSizeFilter,
      orgTypeFilter,
      currentPage
    ],
    queryFn,
    retry:1,
  });

  const showNext = type === "company" 
    ? results?.companies?.length === 10
    : results?.length === 10;
    
  const showPrev = currentPage > 1;

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => prev + direction);
  };

  const processedResults = type === "company" ? results?.companies : results;

  return (
    <ResultsPagePresentation
      type={type}
      keyword={keyword}
      results={processedResults}
      isLoading={isLoading}
      isError={isError}
      currentPage={currentPage}
      showNext={showNext}
      showPrev={showPrev}
      onPageChange={handlePageChange}
      nameFilter={nameFilter}
      companyFilter={companyFilter}
      industryFilter={industryFilter}
      locationFilter={locationFilter}
      connectionDegree={connectionDegree}
      companyIndustryFilter={companyIndustryFilter}
      orgSizeFilter={orgSizeFilter}
      orgTypeFilter={orgTypeFilter}
      setNameFilter={setNameFilter}
      setCompanyFilter={setCompanyFilter}
      setIndustryFilter={setIndustryFilter}
      setLocationFilter={setLocationFilter}
      setConnectionDegree={setConnectionDegree}
      setCompanyIndustryFilter={setCompanyIndustryFilter}
      setOrgSizeFilter={setOrgSizeFilter}
      setOrgTypeFilter={setOrgTypeFilter}
      tempName={tempName}
      setTempName={setTempName}
      tempCompany={tempCompany}
      setTempCompany={setTempCompany}
      tempIndustry={tempIndustry}
      setTempIndustry={setTempIndustry}
      tempLocation={tempLocation}
      setTempLocation={setTempLocation}
      tempCompanyIndustry={tempCompanyIndustry}
      setTempCompanyIndustry={setTempCompanyIndustry}
      error={error}
    />
  );
};

export default ResultsPageContainer;