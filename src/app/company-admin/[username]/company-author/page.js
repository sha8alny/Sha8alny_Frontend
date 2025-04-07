"use client";
import JobsFormContainer from "@/app/components/modules/company-author/container/JobsFormContainer";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
const CompanyJobs = () => {
      const { username } = useParams();
      const searchParams = useSearchParams();
      const logo = searchParams.get("logo");
  return <JobsFormContainer username={username} logo={logo} />;
}

export default CompanyJobs;