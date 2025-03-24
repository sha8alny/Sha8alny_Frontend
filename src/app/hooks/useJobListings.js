import { fetchJobListings } from "@/app/services/jobs";
import { useInfiniteQuery } from "@tanstack/react-query";


const useJobListings = (jobListingsOverride = []) => {
  const skipFetch = jobListingsOverride.length > 0;

  return useInfiniteQuery({
    queryKey: ["jobListings"],
    queryFn: fetchJobListings,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: !skipFetch, // Disable fetching if override is provided
    initialData: skipFetch
      ? {
          pages: [{ data: jobListingsOverride, nextPage: null }],
          pageParams: [1],
        }
      : undefined,
  });
};

export default useJobListings;
