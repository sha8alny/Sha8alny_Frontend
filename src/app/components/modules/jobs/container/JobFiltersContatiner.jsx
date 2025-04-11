import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fetchFilterOptions } from "@/app/services/jobs";
import JobsFilterPresentation from "../presentation/JobFiltersPresentation";
import { 
    parseUrlToFilters, 
    filtersToUrlParams, 
    createSelectedFiltersArray,
    getDefaultFilters,
    getDefaultFilterOptions
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
            const initialFilters = parseUrlToFilters(searchParams);
            setFilters(initialFilters);
            setSelectedFilters(createSelectedFiltersArray(initialFilters));
        }
    }, [searchParams, isLoading]);

    const updateUrlWithFilters = (newFilters) => {
        const params = filtersToUrlParams(newFilters);
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
            updatedFilters.salaryRange = { min: 0, max: 100000 };
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
        const resetFilters = getDefaultFilters();
        
        setFilters(resetFilters);
        setSelectedFilters([]);
        updateUrlWithFilters(resetFilters);
    };

    return (
        <JobsFilterPresentation
            filters={filters}
            options={filterOptions}
            selectedFilters={selectedFilters}
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
            onRemoveFilter={removeFilter}
            onClearAllFilters={clearAllFilters}
        />
    );
}

export default JobsFilterContainer;