"use client";

import { useQuery } from "@tanstack/react-query";
import MembershipStatus from "../presentation/MembershipStatus";
import { fetchMembershipStatus } from "@/app/services/payment";

const MembershipStatusContainer = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["membershipStatus"],
    queryFn: fetchMembershipStatus,
  });

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error: {error.message}</p>;

  return (
    <MembershipStatus
      plan={data.plan}
      connections={data.connections}
      messages={data.messages}
      applications={data.applications}
      renewalDate={data.renewalDate}
    />
  );
};

export default MembershipStatusContainer;
