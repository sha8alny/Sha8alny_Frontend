import { useQuery } from "@tanstack/react-query";
import { SidebarPresentation } from "../../admin/presentation/SidebarPresentation";
import { useRouter } from "next/navigation";

function Sidebar() {
  const router = useRouter();

  const {
    data: sideBar,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sidebarInfo"],
    queryFn: () => fetchSidebarInfo(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return <SidebarPresentationSkeleton isLoading={isLoading} />;
  }

  if (isError || !sideBar) {
    return <SidebarPresentationSkeleton isLoading={isLoading} />;
  }

  const determineStat = (stat) => {
    const getColor = (value, limit) => {
      const ratio = value / limit;
      if (ratio == 1) return "text-red-500 font-semibold";
      if (ratio >= 0.9) return "text-red-500";
      if (ratio >= 0.75) return "text-orange-400";
      if (ratio >= 0.5) return "text-yellow-400";
      return "text-green-400";
    };

    switch (stat.name) {
      case "Connections":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(sideBar?.planDetails?.connectionsCount, 50)} text-sm`}>
            {sideBar?.planDetails?.connectionsCount}/<span className="font-bold">50</span>
          </span>
        );

      case "Job Applications":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(sideBar.jobApplications, 5)} text-sm`}>
            {sideBar.jobApplications}/<span className="font-bold">5</span>
          </span>
        );

      case "Messages":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(sideBar.messages, 10)} text-sm`}>
            {sideBar.messages}/<span className="font-bold">10</span>
          </span>
        );

      case "Plan Expiry Date":
        if (isPremium) {
          if (isExpired) {
            return (
              <span className="text-red-400 text-sm font-bold">Expired</span>
            );
          }
          return (
            <span className="text-green-400 text-sm font-bold">
              {sideBar.expiryDate}
            </span>
          );
        }
        return (
          <span className="text-sm text-yellow-500 font-semibold">N/A</span>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarPresentation sideBar={sideBar} navigateTo={handleNavigation} />
  );
}

export default Sidebar;

const Stats = ({ userInfo }) => {
  const [isPremium, setIsPremium] = useState(userInfo.isPremium);
  const trackedStats = [
    { name: "Connections", icon: Users },
    { name: "Job Applications", icon: BriefcaseBusiness },
    { name: "Messages", icon: MessageSquare },
    { name: "Plan Expiry Date", icon: Calendar },
  ];
  const determineStat = (stat) => {
    const getColor = (value, limit) => {
      const ratio = value / limit;
      if (ratio == 1) return "text-red-500 font-semibold";
      if (ratio >= 0.9) return "text-red-500";
      if (ratio >= 0.75) return "text-orange-400";
      if (ratio >= 0.5) return "text-yellow-400";
      return "text-green-400";
    };

    switch (stat.name) {
      case "Connections":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.connections, 50)} text-sm`}>
            {userInfo.connections}/<span className="font-bold">50</span>
          </span>
        );

      case "Job Applications":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.jobApplications, 5)} text-sm`}>
            {userInfo.jobApplications}/<span className="font-bold">5</span>
          </span>
        );

      case "Messages":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(userInfo.messages, 10)} text-sm`}>
            {userInfo.messages}/<span className="font-bold">10</span>
          </span>
        );

      case "Plan Expiry Date":
        if (isPremium) {
          if (isExpired) {
            return (
              <span className="text-red-400 text-sm font-bold">Expired</span>
            );
          }
          return (
            <span className="text-green-400 text-sm font-bold">
              {userInfo.expiryDate}
            </span>
          );
        }
        return (
          <span className="text-sm text-yellow-500 font-semibold">N/A</span>
        );

      default:
        return null;
    }
  };

  const isExpired = new Date(userInfo.expiryDate) < new Date();
  return (
    <div className="flex flex-col w-full border-[#111] bg-[#1b1f23] border rounded-2xl shadow-sm p-4">
      <h2 className="text font-bold mb-4">
        Your Current Plan:{" "}
        <span
          className={
            isPremium
              ? "text-yellow-500 font-black"
              : "text-green-500 font-semibold"
          }
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {trackedStats.map((stat, index) => (
          <div key={index} className="flex items-center">
            <stat.icon className="size-5 mr-2" />
            <p className="text-sm text-white mr-2">{stat.name}: </p>
            {determineStat(stat)}
          </div>
        ))}
      </div>
    </div>
  );
};
