import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fetchFilterOptions } from "@/app/services/jobs";
import JobsFilterPresentation from "../presentation/JobFiltersPresentation";
import { 
    parseUrlToFilters, 
    filtersToUrlParams, 
    createSelectedFiltersArray,
    getDefaultFilters,
    getDefaultFilterOptions,
    setMaxSalary
} from "@/app/utils/jobFilters";
/**
 * @namespace jobs
 * @module jobs
 */
/**
 * A container component for managing job filtering functionality.
 * 
 * This component handles:
 * - Loading filter options from the API
 * - Synchronizing filters with URL parameters
 * - Managing filter state
 * - Handling filter operations (add, remove, clear)
 * 
 * @returns {JSX.Element} A rendered JobsFilterPresentation component with filter props
 * 
 * @example
 * // In a parent component:
 * <JobsFilterContainer />
 */
function JobsFilterContainer() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filterOptions, setFilterOptions] = useState(getDefaultFilterOptions());
    const [filters, setFilters] = useState(getDefaultFilters());
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load filter options
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const options = await fetchFilterOptions();
                setFilterOptions(prev => ({ ...prev, ...options }));
                
                // When maxSalary changes from the API, update filters accordingly
                if (options.maxSalary) {
                    setMaxSalary(options.maxSalary);
                    setFilters(prev => {
                        // Only update the max if it's the default or higher than API value
                        if (prev.salaryRange.max === 100000 || prev.salaryRange.max > options.maxSalary) {
                            return {
                                ...prev,
                                salaryRange: {
                                    ...prev.salaryRange,
                                    max: options.maxSalary
                                }
                            };
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Error fetching filter options:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFilterOptions();
    }, []);
    // Initialize filters from URL
    useEffect(() => {
        if (!isLoading) {
            const initialFilters = parseUrlToFilters(searchParams, filterOptions.maxSalary);
            setFilters(initialFilters);
            setSelectedFilters(createSelectedFiltersArray(initialFilters, filterOptions.maxSalary));
        }
    }, [searchParams, isLoading, filterOptions.maxSalary]);
    const updateUrlWithFilters = (newFilters) => {
        const params = filtersToUrlParams(newFilters, filterOptions.maxSalary);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleFilterChange = (filterType, value, update = true) => {
        const updatedFilters = { ...filters };

        if (filterType === "salaryRange") {
            updatedFilters.salaryRange = value;
        } else if (Array.isArray(updatedFilters[filterType])) {
            const index = updatedFilters[filterType].indexOf(value);
            if (index > -1) {
                updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value);
            } else {
                updatedFilters[filterType] = [...updatedFilters[filterType], value];
            }
        } else {
            updatedFilters[filterType] = value;
        }

        setFilters(updatedFilters);
        
        if (update) {
            setSelectedFilters(createSelectedFiltersArray(updatedFilters));
            updateUrlWithFilters(updatedFilters);
        }
    };

    const removeFilter = (filterToRemove) => {
        let updatedFilters = { ...filters };

        if (filterToRemove.type === "salaryRange") {
            updatedFilters.salaryRange = { min: 0, max: filterOptions.maxSalary || 100000 };
        } else if (filterToRemove.type === "keyword" || filterToRemove.type === "sortBySalary") {
            updatedFilters[filterToRemove.type] = "";
        } else if (Array.isArray(updatedFilters[filterToRemove.type])) {
            updatedFilters[filterToRemove.type] = updatedFilters[filterToRemove.type].filter(
                (item) => item !== filterToRemove.value
            );
        }

        setFilters(updatedFilters);
        setSelectedFilters(createSelectedFiltersArray(updatedFilters));
        updateUrlWithFilters(updatedFilters);
    };

    const clearAllFilters = () => {
        const resetFilters = getDefaultFilters(filterOptions.maxSalary);
        
        setFilters(resetFilters);
        setSelectedFilters([]);
        updateUrlWithFilters(resetFilters);
    };
    const filterSections = [
        { title: "Location", type: "location", options: filterOptions.location, selected: filters.location },
        { title: "Industry", type: "industry", options: filterOptions.industry, selected: filters.industry },
        { title: "Experience Level", type: "experienceLevel", options: filterOptions.experienceLevel, selected: filters.experienceLevel },
        { title: "Company", type: "company", options: filterOptions.company, selected: filters.company },
        { title: "Employment Type", type: "employmentType", options: filterOptions.employmentType, selected: filters.employmentType },
        { title: "Location Type", type: "workLocation", options: filterOptions.workLocation, selected: filters.workLocation },
      ];
    return (
        <JobsFilterPresentation
            filters={filters}
            options={filterOptions}
            selectedFilters={selectedFilters}
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
            onRemoveFilter={removeFilter}
            onClearAllFilters={clearAllFilters}
            filterSections={filterSections}
        />
    );
}

export default JobsFilterContainer;