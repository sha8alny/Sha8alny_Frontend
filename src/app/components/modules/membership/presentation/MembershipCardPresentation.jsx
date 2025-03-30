import DoneIcon from "@mui/icons-material/Done";

/**
 * @namespace membership
 * @module membership
 */
/**
 * MembershipCardPresentation component renders the membership card.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.plan - The plan name.
 * @param {string} props.price - The plan price.
 * @param {Array} props.items - The list of plan features.
 * @param {boolean} props.isCurrentPlan - Indicates if this is the current plan of the user.
 * @param {boolean} props.isDowngrade - Indicates if this is a downgrade.
 * @param {boolean} props.isPremium - Indicates if this card is for the premium plan.
 * @param {boolean} props.hasPremiumExpired - Indicates if the premium plan has expired.
 * @param {function} props.handler - Function to handle subscription or downgrading or renewal.
 * @param {boolean} props.isCancelling - Indicates if the plan is in the process of being cancelled.
 * @returns {JSX.Element} The rendered component.
 */
const MembershipCardPresentation = ({
  plan,
  price,
  items,
  isCurrentPlan,
  isDowngrade,
  isPremium,
  hasPremiumExpired,
  handler,
  isCancelling,
  currentPlan,
}) => {

  const buttonTextMap = {
    oneTimePremium: "Upgrade to monthly plan",
    cancelling: "Pending...",
    expired: "Renew Plan",
    downgrade: "Downgrade Plan",
    currentPlan:"Current Plan",
    default: "Upgrade Plan"
  };
  
  const buttonText = 
    (currentPlan === "oneTimePremium" && isPremium) ? buttonTextMap.oneTimePremium :
    (currentPlan === "monthlyPremium" && isPremium) ? buttonTextMap.currentPlan:
    isCancelling ? buttonTextMap.cancelling :
    hasPremiumExpired ? buttonTextMap.expired :
    isDowngrade ? buttonTextMap.downgrade :
    buttonTextMap.default;
  
  return (
    <div
      className={`flex flex-col gap-2 w-full max-w-[400px] rounded-xl p-4 shadow-2xl bg-foreground relative ${
        isPremium ? "border-2 border-[#F0A24F] shadow-[0_0_15px_#F0A24F]" : ""
      }`}
    >
      <div className="flex flex-col">
        <h1
          className={`text-2xl font-semibold ${
            isPremium ? "text-[#F0A24F]" : ""
          }`}
        >
          {plan}
        </h1>
        <p className="text-[#857D7D]">{price}</p>
      </div>

      <ul className="list-none flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2 items-center">
            <DoneIcon className="text-green-500" />
            {item}
          </li>
        ))}
      </ul>

      <button
        className={`mt-16 rounded-full p-4 w-11/12 mx-auto transition text-white ${
          currentPlan === "monthlyPremium" && isPremium
            ? "bg-gray-400 cursor-not-allowed"
            : isCancelling && isPremium==false
            ? "bg-secondary cursor-wait"
            : isDowngrade
            ? "bg-gray-500 cursor-pointer"
            : "bg-black hover:bg-gray-900 cursor-pointer"
        }`}
        disabled={ (currentPlan === "monthlyPremium" && isPremium) || isCancelling}
        onClick={() => handler()}
      >
        {buttonText}
     
      </button>
    </div>
  );
};

export default MembershipCardPresentation;
