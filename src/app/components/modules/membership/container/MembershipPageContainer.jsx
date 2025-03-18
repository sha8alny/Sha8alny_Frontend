"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSubscription, cancelSubscription } from "@/app/services/payment";
import MembershipPage from "../presentation/MembershipPage";
import { useToast } from "@/app/context/ToastContext";
import {  useRouter } from "next/navigation";

/**
 * MembershipPageContainer component manages the state and logic for the membership page.
 * It handles fetching the subscription status, cancelling the subscription, and navigating to the upgrade page.
 * 
 * @component
 * @returns {JSX.Element} The rendered MembershipPage component with the current subscription details and actions.
 */

const MembershipPageContainer = () => {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["membershipStatus"],
    queryFn: fetchSubscription,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["membershipStatus"]);
      showToast("Subscription cancelled successfully", true);
    },
    onError: (err) => {
      console.error("Cancellation Error:", err);
      showToast("Failed to cancel subscription", false);
    },
  });

  const handleCancelSubscription = () => {
    cancelMutation.mutate();
  };

  const handleUpgrade = () => {
    router.push("/membership-page/payment");
  };

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-lg text-red-500">Error: {error.message}</p>
    );


  return (
    <MembershipPage
      currentPlan={data?.status}
      limits={data?.limits}
      renewalDate={data?.renewal_date}
      isMissed={data?.is_missed}
      handleCancelSubscription={handleCancelSubscription}
      isCancelling={cancelMutation.isPending}
      handleUpgrade={handleUpgrade}
    />
  );
};

export default MembershipPageContainer;
