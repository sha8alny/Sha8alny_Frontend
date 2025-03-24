"use client";

import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

/**
 * MembershipStatus component displays the current membership plan status of the user.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.plan - The current plan of the user, either "premium" or "basic".
 * @param {Object} props.limits - The limits object containing the user's usage limits.
 * @param {number} props.limits.monthlyConnectionRequests - The number of monthly connection requests.
 * @param {number} props.limits.dailyMessageRequests - The number of daily message requests.
 * @param {number} props.limits.dailyJobApplications - The number of daily job applications.
 * @param {string} props.renewalDate - The renewal date of the current plan.
 * @param {boolean} props.isMissed - Indicates if the renewal date is missed.
 *
 * @returns {JSX.Element} The MembershipStatus component.
 */


const MembershipStatus = ({
  plan,
  limits,
  renewalDate,
  isMissed,
}) => {
  const isPremium = plan === "premium";
  const isExpiredPremium = isMissed;
  const goldText = "text-[#F0A24F]";
  const greenText = "text-green-500";
  const maxConnections = 50,
    maxMessages = 100,
    maxApplications = 20;

  return (
    <div className="mx-auto flex bg-foreground w-full max-w-[725px] p-4 rounded-2xl shadow-2xl">
      <div className="w-full">
        <h1 className="text-primary text-xl font-semibold text-center md:text-left">
          Your current plan:{" "}
          <span
            className={
              isPremium
                ? goldText
                : isExpiredPremium
                ? "text-red-500"
                : greenText
            }
          >
            {isPremium
              ? "Premium"
              : isExpiredPremium
              ? "Premium (Expired)"
              : "Basic"}
          </span>
        </h1>

        <div className="flex flex-col md:flex-row justify-between mt-2 text-lg">
          <div className="flex flex-col gap-2 p-2 md:w-1/2">
            <div className="flex items-center gap-2">
              <GroupsIcon className="mb-1" />
              Connections:{" "}
              {isPremium ? (
                <span className={goldText}>Unlimited</span>
              ) : (
                <>
                  {limits.monthlyConnectionRequests + " "}/
                  <span className={greenText}>{maxConnections}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ChatIcon />
              Messages:{" "}
              {isPremium ? (
                <span className={goldText}>Unlimited</span>
              ) : (
                <>
                  {limits.dailyMessageRequests + " "}/
                  <span className={greenText}>{maxMessages}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:w-1/2 text-right p-2 md:text-left">
            <div className="flex items-center gap-2">
              <BusinessCenterIcon />
              Job Applications:{" "}
              {isPremium ? (
                <span className={goldText}>Unlimited</span>
              ) : (
                <>
                  {limits.dailyJobApplications + " "}/
                  <span className={greenText}>{maxApplications}</span>
                </>
              )}
            </div>

            {isPremium && !isExpiredPremium && (
              <div className="flex gap-2">
                <CalendarMonthIcon />
                Plan ends on: {renewalDate}
              </div>
            )}
            {isExpiredPremium && (
              <div className="flex gap-2">
                <CalendarMonthIcon />
                <p className="text-red-500">
                  Premium Expired on: {renewalDate}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStatus;
