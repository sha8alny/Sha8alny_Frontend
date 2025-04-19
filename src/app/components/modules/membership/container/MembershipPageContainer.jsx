"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubscription,
  cancelSubscription,
  fetchPlansDetails,
  processPaymentMonthly,
  processPaymentOneTime,
} from "@/app/services/payment";
import MembershipPage from "../presentation/MembershipPage";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import MembershipStatusSkeleton from "../presentation/MembershipStatusSkeleton";
import { useState } from "react";

/**
 * @namespace membership
 * @module membership
 */
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  let {
    data: sub,
    isLoading: statusIsLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["membershipStatus"],
    queryFn: fetchSubscription,
  });

  const {
    data: plansDetails,
    isLoading: isPlansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ["plansDetails"],
    queryFn: fetchPlansDetails,
  });
  
  console.log("Plans Details:", plansDetails);
  const plansDetailsList = plansDetails?.Plans;
  
  sub = {
    ...sub?.subscription,
    limits: {
      createProfile: true,
      maxConnections: sub?.connectionCount,
      jobApplications: sub?.jobsApplied,
      dailyMessages: sub?.messagesSent,
    },
  };

  const cancelMutation = useMutation({
    mutationFn: async () => {
      try {
        return await cancelSubscription();
      } catch (error) {
        return { error: error.message || "Failed to cancel subscription" };
      }
    },
    onSuccess: (result) => {
      if (result?.error) {
        showToast(result.error, false);
      } else {
        queryClient.invalidateQueries(["membershipStatus"]);
        showToast("Subscription cancelled successfully", true);
      }
    },
    onError: (err) => {
      console.error("Unexpected cancellation error:", err);
      showToast("An unexpected error occurred", false);
    }
  });

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmCancel = () => {
    cancelMutation.mutate();
    setIsConfirmModalOpen(false);
  };

  const handleUpgrade = () => {
    router.push("/membership-page/payment");
  };
  
  if(statusIsLoading || isPlansLoading) {
    return (<MembershipStatusSkeleton />)
  }
  
  const maxConnections = sub?.limits?.maxConnections || 0;
  const {  jobsApplied, messagesSent } = sub;
  const limits = {
    dailyJobApplications: jobsApplied,
    dailyMessageRequests: messagesSent,
    monthlyConnectionRequests: maxConnections,
  };
 
  const premiumPlanDetails = plansDetailsList?.find(
    (plan) => plan.plan_id === "oneTimePremium"
  );
  const freePlanDetails = plansDetailsList?.find(
    (plan) => plan.plan_id === "free"
  );
  
  return (
    <MembershipPage
      currentPlan={sub?.planId}
      limits={limits}
      premiumPlanDetails={premiumPlanDetails}
      freePlanDetails={freePlanDetails}
      renewalDate={sub?.renewalDate}
      isMissed={sub?.isMissed}
      handleCancelSubscription={handleOpenConfirmModal}
      isCancelling={cancelMutation.isPending}
      handleUpgrade={handleUpgrade}
      statusIsLoading={statusIsLoading}
      statusError={statusError}
      isPlansLoading={isPlansLoading}
      isConfirmModalOpen={isConfirmModalOpen}
      handleCloseConfirmModal={handleCloseConfirmModal}
      handleConfirmCancel={handleConfirmCancel}
    />
  );
};

export default MembershipPageContainer;