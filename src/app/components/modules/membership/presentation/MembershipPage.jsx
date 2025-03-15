"use client";
import SettingsNavbar from "@/app/components/modules/settings/presentation/SettingsNavbar";
import MembershipCard from "./MembershipCard";
import MembershipStatus from "./MembershipStatus";
import PaymentContainer from "../container/PaymentContainer";


const MembershipPage = ({
  currentPlan,
  limits,
  messages,
  renewalDate,
  isMissed,
}) => {
  console.log(renewalDate);
  
  return (
    <div className="bg-background min-h-screen text-text font-sans">
      <SettingsNavbar />
      <div className="flex p-4 flex-col gap-4">
        <h1 className="text-3xl font-bold">Membership</h1>
        <MembershipStatus
          plan={currentPlan}
          limits={limits}
          messages={messages}
          renewalDate={renewalDate}
          isMissed={isMissed}
        />

        <div className="flex flex-col items-center  md:flex-row gap-6 justify-center mt-5">
          <MembershipCard
            plan="Basic"
            price="Free"
            items={[
              "Create a profile",
              "Connect with up to 50 people",
              "Apply to 5 jobs per month",
              "Send 5 messages per day",
            ]}
            handleSubscribe={(selectedPlan) =>
              console.log(`Subscribing to ${selectedPlan}`)
            }
            currentPlan={currentPlan}
            renewalDate={renewalDate}
            isMissed={isMissed}
          />
          <MembershipCard
            plan="Premium"
            price="$29.99/month"
            items={[
              "All Basic Plan features",
              "Unlimited job applications",
              "Connect with 500+ people",
              "Message unlimited connections",
            ]}
            handleSubscribe={(selectedPlan) =>
              console.log(`Subscribing to ${selectedPlan}`)
            }
            currentPlan={currentPlan}
            renewalDate={renewalDate}
            isMissed={isMissed}
          />
        </div>
        <PaymentContainer />
      </div>
    </div>
  );
};
export default MembershipPage;
