"use client";
import FeedIcon from "@mui/icons-material/Feed";

import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Input } from "@/app/components/ui/Input";
import { Briefcase, User, FileText, Filter } from "lucide-react";
import CompanyCardContainer from "@/app/components/modules/search/container/CompanyCardContainer";
import PersonCardContainer from "@/app/components/modules/search/container/PersonCardContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import PostsContainer from "../../feed/container/PostsContainer";
import React from "react";
const UserFilters = ({
  tempName,
  setTempName,
  tempCompany,
  setTempCompany,
  tempIndustry,
  setTempIndustry,
  tempLocation,
  setTempLocation,
  connectionDegree,
  setNameFilter,
  setCompanyFilter,
  setIndustryFilter,
  setLocationFilter,
  setConnectionDegree,
}) => (
  <div className="bg-background p-4 rounded-lg shadow border h-fit w-full sticky top-20">
    <div className="flex items-center gap-2 mb-4">
      <Filter className="h-4 w-4 text-primary" />
      <h3 className="text-md font-semibold">Filters</h3>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Name
        </label>
        <Input
          key="name-filter-input"
          placeholder="Enter name"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setNameFilter(tempName);
            }
          }}
          onBlur={() => setNameFilter(tempName)}
          className="h-9 w-full"
          data-testid="user-name-filter-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Company
        </label>
        <Input
          key="company-filter-input"
          placeholder="Enter company"
          value={tempCompany}
          onChange={(e) => setTempCompany(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCompanyFilter(tempCompany);
            }
          }}
          onBlur={() => setCompanyFilter(tempCompany)}
          className="h-9 w-full"
          data-testid="user-company-filter-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Industry
        </label>
        <Input
          key="industry-filter-input"
          placeholder="Enter industry"
          value={tempIndustry}
          onChange={(e) => setTempIndustry(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIndustryFilter(tempIndustry);
            }
          }}
          onBlur={() => setIndustryFilter(tempIndustry)}
          className="h-9 w-full"
          data-testid="user-industry-filter-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Location
        </label>
        <Input
          key="location-filter-input-user"
          placeholder="Enter location"
          value={tempLocation}
          onChange={(e) => setTempLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLocationFilter(tempLocation);
            }
          }}
          onBlur={() => setLocationFilter(tempLocation)}
          className="h-9 w-full"
          data-testid="user-location-filter-input"
        />
      </div>

      <div className="space-y-2 w-full">
        <label className="text-xs font-medium text-muted-foreground">
          Connection
        </label>
        <Select
          value={connectionDegree}
          onValueChange={setConnectionDegree}
          data-testid="user-connection-select"
        >
          <SelectTrigger
            className="h-9 w-full"
            data-testid="user-connection-trigger"
          >
            <SelectValue placeholder="Connection degree" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={1} data-testid="user-connection-1st">
              1st Degree
            </SelectItem>
            <SelectItem value={2} data-testid="user-connection-2nd">
              2nd Degree
            </SelectItem>
            <SelectItem value={3} data-testid="user-connection-3rd">
              3rd Degree
            </SelectItem>
            <SelectItem value={null} data-testid="all-degrees">
              All
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const CompanyFilters = ({
  tempCompanyIndustry,
  setTempCompanyIndustry,
  tempLocation,
  setTempLocation,
  orgSizeFilter,
  orgTypeFilter,
  setCompanyIndustryFilter,
  setNameFilter,
  setLocationFilter,
  setOrgSizeFilter,
  setOrgTypeFilter,
  tempName,
}) => (
  <div className="bg-background p-4 rounded-lg shadow border h-fit w-full sticky top-20">
    <div className="flex items-center gap-2 mb-4">
      <Filter className="h-4 w-4 text-primary" />
      <h3 className="text-md font-semibold">Filters</h3>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Name
        </label>
        <Input
          key="company-name-filter-input"
          placeholder="Enter industry"
          value={tempName}
          onChange={(e) => setNameFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setNameFilter(e.target.value);
            }
          }}
          onBlur={(e) => setNameFilter(e.target.value)}
          className="h-9 w-full"
          data-testid="company-name-filter-input"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Industry
        </label>
        <Input
          key="company-industry-filter-input"
          placeholder="Enter industry"
          value={tempCompanyIndustry}
          onChange={(e) => setTempCompanyIndustry(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCompanyIndustryFilter(tempCompanyIndustry);
            }
          }}
          onBlur={() => setCompanyIndustryFilter(tempCompanyIndustry)}
          className="h-9 w-full"
          data-testid="company-industry-filter-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Location
        </label>
        <Input
          key="location-filter-input-company"
          placeholder="Enter location"
          value={tempLocation}
          onChange={(e) => setTempLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLocationFilter(tempLocation);
            }
          }}
          onBlur={() => setLocationFilter(tempLocation)}
          className="h-9 w-full"
          data-testid="company-location-filter-input"
        />
      </div>

      <div className="space-y-2 w-full">
        <label className="text-xs font-medium text-muted-foreground">
          Organization Size
        </label>
        <Select
          value={orgSizeFilter}
          onValueChange={setOrgSizeFilter}
          data-testid="company-size-select"
        >
          <SelectTrigger
            className="h-9 w-full"
            data-testid="company-size-trigger"
          >
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null} data-testid="all-size">
              All
            </SelectItem>
            <SelectItem value="0-1 employees" data-testid="company-size-0-1">
              0-1 employees
            </SelectItem>
            <SelectItem value="2-10 employees" data-testid="company-size-2-10">
              2-10 employees
            </SelectItem>
            <SelectItem
              value="11-50 employees"
              data-testid="company-size-11-50"
            >
              11-50 employees
            </SelectItem>
            <SelectItem
              value="51-200 employees"
              data-testid="company-size-51-200"
            >
              51-200 employees
            </SelectItem>
            <SelectItem
              value="201-500 employees"
              data-testid="company-size-201-500"
            >
              201-500 employees
            </SelectItem>
            <SelectItem
              value="501-1,000 employees"
              data-testid="company-size-501-1000"
            >
              501-1,000 employees
            </SelectItem>
            <SelectItem
              value="1,001-5,000 employees"
              data-testid="company-size-1001-5000"
            >
              1,001-5,000 employees
            </SelectItem>
            <SelectItem
              value="5,001-10,000 employees"
              data-testid="company-size-5001-10000"
            >
              5,001-10,000 employees
            </SelectItem>
            <SelectItem
              value="10,000+ employees"
              data-testid="company-size-10000plus"
            >
              10,000+ employees
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-full">
        <label className="text-xs font-medium text-muted-foreground">
          Organization Type
        </label>
        <Select
          value={orgTypeFilter}
          onValueChange={setOrgTypeFilter}
          data-testid="company-type-select"
        >
          <SelectTrigger
            className="h-9 w-full"
            data-testid="company-type-trigger"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null} data-testid="all-type">
              All
            </SelectItem>
            <SelectItem
              value="Public company"
              data-testid="company-type-public"
            >
              Public company
            </SelectItem>
            <SelectItem value="Self employed" data-testid="company-type-self">
              Self employed
            </SelectItem>
            <SelectItem
              value="Government agency"
              data-testid="company-type-government"
            >
              Government agency
            </SelectItem>
            <SelectItem value="Nonprofit" data-testid="company-type-nonprofit">
              Nonprofit
            </SelectItem>
            <SelectItem
              value="Sole proprietorship"
              data-testid="company-type-sole"
            >
              Sole proprietorship
            </SelectItem>
            <SelectItem
              value="Privately held"
              data-testid="company-type-private"
            >
              Privately held
            </SelectItem>
            <SelectItem
              value="Partnership"
              data-testid="company-type-partnership"
            >
              Partnership
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const MemoizedUserFilters = React.memo(UserFilters);
const MemoizedCompanyFilters = React.memo(CompanyFilters);

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
 * @param {string} [props.locationFilter] - The filter value for the "Location" field.
 * @param {string} [props.connectionDegreeFilter] - The filter value for the "Connection Degree" field (used when `type` is "user").
 * @param {string} [props.companyIndustryFilter] - The filter value for the "Industry" field (used when `type` is "company").
 * @param {string} [props.orgSizeFilter] - The filter value for the "Organization Size" field (used when `type` is "company").
 * @param {string} [props.orgTypeFilter] - The filter value for the "Organization Type" field (used when `type` is "company").
 * @param {function} [props.setNameFilter] - Callback function to update the "Name" filter value.
 * @param {function} [props.setCompanyFilter] - Callback function to update the "Company" filter value.
 * @param {function} [props.setIndustryFilter] - Callback function to update the "Industry" filter value.
 * @param {function} [props.setLocationFilter] - Callback function to update the "Location" filter value.
 * @param {function} [props.setConnectionDegreeFilter] - Callback function to update the "Connection Degree" filter value.
 * @param {function} [props.setCompanyIndustryFilter] - Callback function to update the "Company Industry" filter value.
 * @param {function} [props.setOrgSizeFilter] - Callback function to update the "Organization Size" filter value.
 * @param {function} [props.setOrgTypeFilter] - Callback function to update the "Organization Type" filter value.
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
  locationFilter,
  connectionDegree,
  companyIndustryFilter,
  orgSizeFilter,
  orgTypeFilter,
  setNameFilter,
  setCompanyFilter,
  setIndustryFilter,
  setLocationFilter,
  setConnectionDegree,
  setCompanyIndustryFilter,
  setOrgSizeFilter,
  setOrgTypeFilter,
  tempName,
  setTempName,
  tempCompany,
  setTempCompany,
  tempIndustry,
  setTempIndustry,
  tempLocation,
  setTempLocation,
  tempCompanyIndustry,
  setTempCompanyIndustry,
  error,
}) => {
  if (type === "post") {
    return (
      <>
        <div className="bg-foreground mt-4 flex flex-row rounded-lg p-4 text-text mx-auto mb-4 w-full max-w-3xl ">
          <div className="flex flex-row w-full items-center justify-between ">
            <h1 className="text-lg font-bold text-center flex items-center gap-1">
              <FeedIcon sx={{ fontSize: "1.125rem" }} /> Posts
            </h1>
            <p className="text-sm text-gray-500 ml-2 mt-1">
              Showing results for keyword{" "}
              <strong className="text-base">{keyword}</strong>
            </p>
          </div>
        </div>
        <PostsContainer keyword={keyword} />
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-text px-4 py-6">
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        <div className="w-full lg:w-3/4 space-y-4">
          <ResultsCard
            title={`Results for "${keyword}"`}
            icon={iconMap[type]}
            isLoading={isLoading}
            data-testid="search-results-card"
          >
            {isError && (
              <p className="text-gray-400 text-sm">{error.message}</p>
            )}

            {results?.length > 0 ? (
              <>
                {results.map((item, index) => {
                  if (type === "company") {
                    return (
                      <CompanyCardContainer key={item.companyId} {...item} />
                    );
                  }
                  if (type === "user") {
                    return (
                      <PersonCardContainer
                        key={item.id || index}
                        username={item.username}
                        name={item.name}
                        avatarUrl={item.profilePicture}
                        position={item.position}
                        company={item.company}
                        headline={item.headline}
                        about={item.about}
                        location={item.location}
                        onConnect={() =>
                          console.log(`Connect with ${item.name}`)
                        }
                      />
                    );
                  }
                })}
              </>
            ) : (
              !isLoading &&
              !isError && (
                <p className="text-gray-400 text-sm">No results found.</p>
              )
            )}
          </ResultsCard>

          <div className="p-4 border-border bg-background flex justify-between items-center rounded-lg shadow">
            <button
              className={`text-secondary p-2 rounded-md ${
                !showPrev
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary/10 cursor-pointer"
              }`}
              disabled={!showPrev}
              onClick={() => onPageChange(-1)}
              data-testid="pagination-prev-button"
            >
              Previous
            </button>
            <span className="text-sm text-text">Page {currentPage}</span>
            <button
              className={`text-secondary p-2 rounded-md ${
                !showNext
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary/10 cursor-pointer"
              }`}
              onClick={() => onPageChange(1)}
              disabled={!showNext}
              data-testid="pagination-next-button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
          {type === "user" && (
            <MemoizedUserFilters
              tempName={tempName}
              setTempName={setTempName}
              tempCompany={tempCompany}
              setTempCompany={setTempCompany}
              tempIndustry={tempIndustry}
              setTempIndustry={setTempIndustry}
              tempLocation={tempLocation}
              setTempLocation={setTempLocation}
              connectionDegree={connectionDegree}
              setNameFilter={setNameFilter}
              setCompanyFilter={setCompanyFilter}
              setIndustryFilter={setIndustryFilter}
              setLocationFilter={setLocationFilter}
              setConnectionDegree={setConnectionDegree}
            />
          )}
          {type === "company" && (
            <MemoizedCompanyFilters
              tempCompanyIndustry={tempCompanyIndustry}
              setTempCompanyIndustry={setTempCompanyIndustry}
              tempLocation={tempLocation}
              setTempLocation={setTempLocation}
              orgSizeFilter={orgSizeFilter}
              orgTypeFilter={orgTypeFilter}
              setCompanyIndustryFilter={setCompanyIndustryFilter}
              setLocationFilter={setLocationFilter}
              setOrgSizeFilter={setOrgSizeFilter}
              setOrgTypeFilter={setOrgTypeFilter}
              setNameFilter={setNameFilter}
              tempName={tempName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResultsPagePresentation);
