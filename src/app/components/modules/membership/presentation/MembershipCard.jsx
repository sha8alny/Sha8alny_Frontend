import DoneIcon from "@mui/icons-material/Done";

const MembershipCard = ({
  plan,
  price,
  items,
  handleSubscribe,
  currentPlan,
  renewalDate,
  isMissed
}) => {

  let isCurrentPlan = currentPlan === plan.toLowerCase();
  if(currentPlan === "free" && plan.toLowerCase() === "basic"){
    isCurrentPlan = true
  }
  const isDowngrade = currentPlan === "premium" && plan === "Basic";
  const isPremium = plan.toLowerCase() === "premium";
  const hasPremiumExpired = isMissed;
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
          isCurrentPlan
            ? "bg-gray-400 cursor-not-allowed"
            : isDowngrade
            ? "bg-gray-500 cursor-pointer "
            : "bg-black hover:bg-gray-900 cursor-pointer"
        }`}
        disabled={isCurrentPlan}
        onClick={() => !isCurrentPlan && handleSubscribe(plan)}
      >
        {isCurrentPlan
          ? "Current Plan"
          : hasPremiumExpired
          ? "Renew Plan"
          : isDowngrade
          ? "Downgrade Plan"
          : "Upgrade Plan"}
      </button>
    </div>
  );
};

export default MembershipCard;
