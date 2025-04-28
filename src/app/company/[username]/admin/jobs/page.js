"use client";
import JobsFormContainer from "@/app/components/modules/company-jobs/container/JobsFormContainer";
import { useParams } from "next/navigation";
import { Suspense } from "react";
const CompanyJobs = () => {
      const { username } = useParams();

  return (
    <Suspense
      fallback={
        <div className="animate-pulse">Loading...</div>
      }>
  <JobsFormContainer username={username} />
    </Suspense>
  );
}

export default CompanyJobs;