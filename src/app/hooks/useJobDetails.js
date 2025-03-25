import { fetchJobDetails } from "@/app/services/jobs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams } from "next/navigation";

export default function useJobDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.id;

  const title = searchParams.get("title");
  const companyName = searchParams.get("company");
  
  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
    initialData: jobId && title && companyName
      ? { id: jobId, title, company: { name: companyName } }
      : undefined,
  });
  

  return {
    job,
    isLoading,
    isError,
    errorMessage: isError ? error.message : null,
  };
}
