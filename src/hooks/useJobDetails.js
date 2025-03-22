import { fetchJobDetails } from "@/app/services/jobs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams } from "next/navigation";

export default function useJobDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.id;

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId, // Only fetch if jobId exists
    initialData: jobId
    ? {
        job_id: jobId,
        title: searchParams.get("title"),
        company_data :{ name: searchParams.get("company")},
      }
    : undefined,
  });

  return {
    job,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
  };
}
