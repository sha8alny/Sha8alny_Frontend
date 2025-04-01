"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchJobListings } from "@/app/services/search";
import  JobSectionAllPresentation  from "../presentation/JobSectionAllPresentation";
import { normalizeJob } from "@/app/utils/normalizeJob";

 const JobSectionAllContainer = ({ query }) => {
  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ["jobListings", query],
    queryFn: () => fetchJobListings(query, 1),
  });

  const router = useRouter();

  const handleViewMore = () => {
    router.push("/jobs");
  };

  const normalizedJobs = jobs?.map((job) => normalizeJob(job)) || [];

  return (
    <JobSectionAllPresentation
      jobs={normalizedJobs}
      isLoading={isLoading}
      isError={isError}
      onViewMore={handleViewMore}
    />
  );
};

export default JobSectionAllContainer;