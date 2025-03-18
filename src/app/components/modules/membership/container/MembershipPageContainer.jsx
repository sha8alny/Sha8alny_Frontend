"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubscription,
  cancelSubscription,
  fetchPlansDetails,
} from "@/app/services/payment";
import MembershipPage from "../presentation/MembershipPage";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

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
  const {
    data: plansDetails,
    isLoading: isPlansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ["plansDetails"],
    queryFn: fetchPlansDetails,
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

  if (isLoading || isPlansLoading)
    return <p className="text-center text-lg">Loading...</p>;
  if (error || plansError)
    return (
      <p className="text-center text-lg text-red-500">
        Error: {error?.message || plansError?.message}
      </p>
    );

  const { max_connections, job_applications, daily_messages } = data?.limits;
  const limits = {
    daily_job_applications: job_applications,
    daily_message_requests: daily_messages,
    monthly_connection_requests: max_connections,
  };

  const plans_details = plansDetails;

  const premiumPlanDetails = plans_details.find(
    (plan) => plan.plan_id === "premium"
  );

  const freePlanDetails = plans_details.find((plan) => plan.plan_id === "free");
  return (
    <MembershipPage
      currentPlan={data?.status}
      limits={limits}
      premiumPlanDetails={premiumPlanDetails}
      freePlanDetails={freePlanDetails}
      renewalDate={data?.renewal_date}
      isMissed={data?.is_missed}
      handleCancelSubscription={handleCancelSubscription}
      isCancelling={cancelMutation.isPending}
      handleUpgrade={handleUpgrade}
    />
  );
};

export default MembershipPageContainer;
