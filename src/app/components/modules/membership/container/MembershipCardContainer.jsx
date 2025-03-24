"use client"
import MembershipCardPresentation from "../presentation/MembershipCardPresentation";

/**
 * MembershipCardContainer component manages the state and logic for the membership card.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.plan - The plan name.
 * @param {string} props.price - The plan price.
 * @param {Array} props.items - The list of plan features.
 * @param {string} props.currentPlan - The current plan of the user.
 * @param {string} props.renewalDate - The renewal date of the plan.
 * @param {boolean} props.isMissed - Indicates if the renewal date is missed.
 * @param {function} props.handleUpgrade - Function to handle subscription upgrade.
 * @param {function} props.handleCancel - Function to handle subscription cancellation.
 * @param {boolean} props.isCancelling - Indicates if the cancellation process is ongoing.
 * @returns {JSX.Element} The rendered component.
 */
const MembershipCardContainer = ({
  plan,
  price,
  items,
  currentPlan,
  renewalDate,
  isMissed,
  handleUpgrade,
  handleCancel,
  isCancelling,
}) => {
  // card's display logic
  const isPremium = plan.toLowerCase() === "premium";

  // user's current plan related logic
  let isCurrentPlan = currentPlan === plan.toLowerCase();
  if (currentPlan === "free" && plan.toLowerCase() === "basic") {
    isCurrentPlan = true;
  }

  const isDowngrade = currentPlan === "premium" && plan === "Basic";
  const hasPremiumExpired = isMissed;

  return (
    <MembershipCardPresentation
      plan={plan}
      price={price}
      items={items}
      isCurrentPlan={isCurrentPlan}
      isDowngrade={isDowngrade}
      isPremium={isPremium}
      hasPremiumExpired={hasPremiumExpired}
      handler={isDowngrade ? handleCancel : handleUpgrade}
      isCancelling={isCancelling}
    />
  );
};

export default MembershipCardContainer;
