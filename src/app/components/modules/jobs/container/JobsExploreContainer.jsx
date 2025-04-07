import { useRouter, useSearchParams } from "next/navigation";
import JobsExplorePresentation from "../presentation/JobsExplorePresentation";
import { normalizeJob } from "@/app/utils/normalizeJob";
import { useEffect, useState } from "react";
import { formatFiltersForApi, parseUrlToFilters } from "@/app/utils/jobFilters";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchJobListings } from "@/app/services/jobs";

function JobsExploreContainer() {
  const router = useRouter();
  const useJobListings = ({ itemsPerPage = 10 } = {}) => {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState(parseUrlToFilters(searchParams));
    
    // Update filters when URL parameters change
    useEffect(() => {
      setFilters(parseUrlToFilters(searchParams));
    }, [searchParams]);
  
    // Use react-query's useInfiniteQuery for pagination
    const queryResult = useInfiniteQuery({
      queryKey: ['jobListings', filters],
      queryFn: ({ pageParam = 1 }) => fetchJobListings({
        pageParam,
        filters: formatFiltersForApi(filters),
        itemsPerPage
      }),
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
      // Keep previous data when fetching a new page
      keepPreviousData: true,
      // Only refetch on window focus if data is stale (3 minutes)
      staleTime: 3 * 60 * 1000,
      // Don't refetch on window focus if data is fresh (prevents jarring experience)
      refetchOnWindowFocus: false,
    });
    
    // Flatten the paged data structure for easier consumption
    const flattenedData = queryResult.data?.pages.flatMap(page => page.data) || [];
    
    // Track if a search is currently being performed
    const isSearching = Boolean(
      filters.keyword || 
      filters.location?.length || 
      filters.industry?.length || 
      filters.company?.length || 
      filters.experienceLevel?.length || 
      filters.employmentType?.length || 
      filters.workLocation?.length || 
      (filters.salaryRange?.min > 0 || filters.salaryRange?.max < 100000)
    );
  
    return {
      ...queryResult,
      filters,
      flattenedData,
      isSearching
    };
  };

  const {
    flattenedData,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isSearching
  } = useJobListings({
    itemsPerPage: 10
  });

  // Normalize job data to ensure consistent format
  const normalizedJobs = normalizeJob(flattenedData || []);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleJobClick = (job) => {
    router.push(
      `/jobs/${job.id}?title=${encodeURIComponent(
        job.title || "Job Opening"
      )}&company=${encodeURIComponent(job.company.name)}`
    );
  };

  return (
    <JobsExplorePresentation
      data={normalizedJobs}
      error={error}
      isLoading={isLoading}
      fetchNextPage={handleLoadMore}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      handleJobClick={handleJobClick}
      isSearching={isSearching}
    />
  );
}

export default JobsExploreContainer;