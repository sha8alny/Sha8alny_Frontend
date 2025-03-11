import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const MembershipStatus = ({
  plan,
  connections,
  messages,
  applications,
  renewalDate,
}) => {
  const isPremium = plan === "Premium";
  const isExpiredPremium = plan === "Basic" && renewalDate;
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
                  {connections}/
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
                  {messages}/<span className={greenText}>{maxMessages}</span>
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
                  {applications}/
                  <span className={greenText}>{maxApplications}</span>
                </>
              )}
            </div>

            {isPremium && (
              <div className="flex gap-2">
                <CalendarMonthIcon />
                Plan ends on: {renewalDate}
              </div>
            )}
            {isExpiredPremium && (
              <div className="text-red-500">
                Premium Expired on: {renewalDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStatus;
