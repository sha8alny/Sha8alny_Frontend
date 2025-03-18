
"use client";
import MembershipCardContainer from "../container/MembershipCardContainer";
import MembershipStatus from "./MembershipStatus";
import MembershipPageLayout from "./MembershipPageLayout";
/**
 * MembershipPage component displays the membership dashboard with current plan details and options to upgrade or cancel the subscription.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentPlan - The current membership plan of the user.
 * @param {Object} props.limits - The limits associated with the current plan.
 * @param {string} props.renewalDate - The renewal date of the current plan.
 * @param {boolean} props.isMissed - Indicates if the renewal date has been missed.
 * @param {Function} props.handleCancelSubscription - Function to handle the cancellation of the subscription.
 * @param {boolean} props.isCancelling - Indicates if the cancellation process is ongoing.
 * @param {Function} props.handleUpgrade - Function to handle the upgrade of the subscription.
 *
 * @returns {JSX.Element} The rendered MembershipPage component with the current subscription details and actions.
 */


const MembershipPage = ({
  currentPlan,
  limits,
  renewalDate,
  isMissed,
  handleCancelSubscription,
  isCancelling,
  handleUpgrade,
}) => {
  return (
    <MembershipPageLayout>
      <div className="flex p-4 flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <MembershipStatus
          plan={currentPlan}
          limits={limits}
          renewalDate={renewalDate}
          isMissed={isMissed}
        />

        <div className="flex flex-col items-center  md:flex-row gap-6 justify-center mt-5">
          <MembershipCardContainer
            plan="Basic"
            price="Free"
            items={[
              "Create a profile",
              "Connect with up to 50 people",
              "Apply to 5 jobs per month",
              "Send 5 messages per day",
            ]}
            currentPlan={currentPlan}
            renewalDate={renewalDate}
            isMissed={isMissed}
            handleUpgrade={handleUpgrade}
            handleCancel={handleCancelSubscription}
            isCancelling={isCancelling}
          />
          <MembershipCardContainer
            plan="Premium"
            price="$9.99/month"
            items={[
              "All Basic Plan features",
              "Unlimited job applications",
              "Connect with 500+ people",
              "Message unlimited connections",
            ]}
            currentPlan={currentPlan}
            renewalDate={renewalDate}
            isMissed={isMissed}
            handleUpgrade={handleUpgrade}
            handleCancel={handleCancelSubscription}
            isCancelling={isCancelling}
          />
        </div>
      </div>
    </MembershipPageLayout>
  );
};

export default MembershipPage;
