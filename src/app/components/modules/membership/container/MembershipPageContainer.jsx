"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubscription } from "@/app/services/payment";
import MembershipPage from "../presentation/MembershipPage";

const MembershipPageContainer = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["membershipStatus"],
    queryFn: fetchSubscription,
  });

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-lg text-red-500">Error: {error.message}</p>
    );
    
    const messages = "2"
    

  return (
    <MembershipPage
      currentPlan={data?.status}
      limits={data?.limits}
      messages={messages}
      renewalDate={data?.renewal_date}
      isMissed = {data?.is_missed}
    />
  );
};

export default MembershipPageContainer;
