"use client";
import { useParams } from "next/navigation";
import DashboardContainer from "@/app/components/modules/company-page-author/container/DashboardContainer";

export default function CompanyPageAuthor() 
{
  const { username } = useParams();
  return (
    <div>
      <DashboardContainer username={username} />
    </div>

  );
}
