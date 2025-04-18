"use client";
import MembershipCardContainer from "../container/MembershipCardContainer";
import MembershipStatus from "./MembershipStatus";
import MembershipPageLayout from "./MembershipPageLayout";
/**
 * @namespace membership
 * @module membership
 */
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
  premiumPlanDetails,
  freePlanDetails,
  renewalDate,
  isMissed,
  handleCancelSubscription,
  isCancelling,
  handleUpgrade,
  statusIsLoading,
  statusError,
}) => {

  return (
    
    <MembershipPageLayout>
      <div className="flex p-4 flex-col gap-4 mt-10">
       
        <MembershipStatus
          plan={currentPlan}
          limits={limits}
          renewalDate={renewalDate}
          isMissed={isMissed}
          freePlanDetails={freePlanDetails}
          statusIsLoading={statusIsLoading}
          statusError={statusError}
        />

        <div className="flex flex-col items-center  md:flex-row gap-6 justify-center mt-5">
          <MembershipCardContainer
            plan="Basic"
            price="Free"
            items={[
              `${
                freePlanDetails.features.createProfile === true
                  ? "Create a profile"
                  : "Access to feed"
              }`,
              `Connect with up to ${freePlanDetails.features.maxConnections} people`,
              `Apply to ${freePlanDetails.features.jobApplications} jobs per month`,
              `Send ${freePlanDetails.features.dailyMessages} messages per day`,
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
            price={`${
              premiumPlanDetails.currency === "USD"
                ? "$"
                : premiumPlanDetails.currency
            }${premiumPlanDetails.price}/month`}
            items={[
              "All Basic Plan features",
              `${
                premiumPlanDetails.features.jobApplications == null
                  ? "unlimited"
                  : premiumPlanDetails.features.jobApplications
              } job applications`,
              `Connect with ${premiumPlanDetails.features.maxConnections}+ people`,
              `Message ${
                premiumPlanDetails.features.dailyMessages == null
                  ? "unlimited"
                  : premiumPlanDetails.features.dailyMessages
              } connections`,
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
