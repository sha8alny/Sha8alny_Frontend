"use client";
import JobsFormContainer from "@/app/components/modules/company-author/container/JobsFormContainer";
import { useParams } from "next/navigation";
const CompanyJobs = () => {
      const { username } = useParams();

  return <JobsFormContainer username={username} />;
}

export default CompanyJobs;