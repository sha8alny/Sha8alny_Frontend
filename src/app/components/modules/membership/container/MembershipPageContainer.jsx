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
  let {
    data: sub,
    isLoading:statusIsLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["membershipStatus"],
    queryFn: fetchSubscription,
  });

  // const {
  //   data: plansDetails,
  //   isLoading: isPlansLoading,
  //   error: plansError,
  // } = useQuery({
  //   queryKey: ["plansDetails"],
  //   queryFn: fetchPlansDetails,
  // });

  const isPlansLoading = false;
  const plansError = null;
  sub = {
    ...sub?.subscription,
    limits: {
      createProfile: true,
      maxConnections:sub?.connectionCount,
      jobApplications: sub?.jobsApplied,
      dailyMessages: sub?.messagesSent,
    },
  };
  //   const sub = {
  //     _id: "67e7370936ea56d6f82b70ca",
  //     planId: "free",
  //     status: "active",
  //     renewalDate: null,
  //     canceledAt: null,
  //     stripeCustomerId: null,
  //     stripeSubscriptionId: null,
  //     createdAt: "2025-03-28T23:55:53.906Z",
  //     updatedAt: "2025-03-28T23:55:53.906Z",
  //     __v: 0,
  //     limits: {
  //         createProfile: true,
  //         maxConnections: 50,
  //         jobApplications: 5,
  //         dailyMessages: 5
  //     }
  // };

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

  const handleCancelSubscription = () => {
    cancelMutation.mutate();
  };

  const handleUpgrade = () => {
    router.push("/membership-page/payment");
  };
  
  
  if(statusIsLoading || isPlansLoading) {
    return (<MembershipStatusSkeleton />)
  }
 

  const { maxConnections, jobApplications, dailyMessages } = sub?.limits;
  const limits = {
    dailyJobApplications: jobApplications,
    dailyMessageRequests: dailyMessages,
    monthlyConnectionRequests: maxConnections,
  };
 
  const plansDetailsList = [
    {
      planId: "premium",
      name: "Premium Plan",
      description: "Full access with unlimited features",
      price: 9.99,
      currency: "USD",
      features: {
        createProfile: true,
        maxConnections: 500,
        jobApplications: null,
        dailyMessages: null,
      },
    },
    {
      planId: "free",
      name: "Basic Plan",
      description: "get a job",
      price: 0,
      currency: "USD",
      features: {
        createProfile: true,
        maxConnections: 50,
        jobApplications: 5,
        dailyMessages: 5,
      },
    },
  ];

  const premiumPlanDetails = plansDetailsList.find(
    (plan) => plan.planId === "premium"
  );
  const freePlanDetails = plansDetailsList.find(
    (plan) => plan.planId === "free"
  );
  return (
    <MembershipPage
      currentPlan={sub?.planId}
      limits={limits}
      premiumPlanDetails={premiumPlanDetails}
      freePlanDetails={freePlanDetails}
      renewalDate={sub?.renewalDate}
      isMissed={sub?.isMissed}
      handleCancelSubscription={handleCancelSubscription}
      isCancelling={cancelMutation.isPending}
      handleUpgrade={handleUpgrade}
      statusIsLoading={statusIsLoading}
      statusError={statusError}
    />
  );
};

export default MembershipPageContainer;
