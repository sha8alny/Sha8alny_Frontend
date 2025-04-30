"use client";

import { useQuery } from "@tanstack/react-query";
import  DashboardPresentation  from "@/app/components/modules/admin/presentation/DashboardPresentation";
import {fetchDashboardData} from "@/app/services/admin"

function DashboardContainer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  if (error) {
    return (
      <div className="p-8">Error loading dashboard data: {error.message}</div>
    );
  }

  return <DashboardPresentation data={data} isLoading={isLoading} />;
}

export default DashboardContainer;
