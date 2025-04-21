"use client";

import { useQuery } from "@tanstack/react-query";
import  DashboardPresentation  from "@/app/components/modules/admin/presentation/DashboardPresentation";

// Real API function - fetching from the actual endpoint
const fetchDashboardData = async () => {
  try {
    const response = await fetch("http://localhost:5000/admin/analytics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching analytics data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};

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
