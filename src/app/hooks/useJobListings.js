import { fetchJobListings } from "@/app/services/jobs";
import { useInfiniteQuery } from "@tanstack/react-query";

const useJobListings = () => {
  return useInfiniteQuery({
    queryKey: ["jobListings"],
    queryFn: fetchJobListings,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });
};

export default useJobListings;
