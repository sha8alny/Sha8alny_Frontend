"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CalendarMonth, Group, Message, Work } from "@mui/icons-material";
import LeftSidebarPresentation, { LeftSidebarPresentationSkeleton } from "../presentation/LeftSidebarPresentation";
import { fetchSidebarInfo } from "@/app/services/fetchSideBarInfo";
import PostButton from "./PostButton";

function LeftSidebar({ addButton = false }) {
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
    return <LeftSidebarPresentationSkeleton />;
  }

  if (isError || !sideBar) {
    return <LeftSidebarPresentationSkeleton isLoading={isLoading} />;
  }

  const trackedStats = [
    { name: "Connections", icon: Group },
    { name: "Job Applications", icon: Work },
    { name: "Messages", icon: Message },
    { name: "Plan Expiry Date", icon: CalendarMonth },
  ];

  const isExpired = new Date(sideBar?.planDetails?.expiryDate) < new Date();
  const isPremium = sideBar?.planDetails?.isPremium;

  const determineStat = (stat) => {
    const getColor = (value, limit) => {
      const ratio = value / limit;
      if (ratio == 1) return "text-red-600 dark:text-red-500 font-semibold";
      if (ratio >= 0.9) return "text-red-600 dark:text-red-500";
      if (ratio >= 0.75) return "text-orange-500 dark:text-orange-400";
      if (ratio >= 0.5) return "text-yellow-500 dark:text-yellow-400";
      return "text-green-500 dark:text-green-400";
    };

    switch (stat.name) {
      case "Connections":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-600 dark:text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span
            className={`${getColor(
              sideBar?.planDetails?.connectionsCount,
              50
            )} text-sm`}
          >
            {sideBar?.planDetails?.connectionsCount}/
            <span className="font-bold">50</span>
          </span>
        );

      case "Job Applications":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-600 dark:text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(sideBar.planDetails?.jobApplications, 5)} text-sm`}>
            {sideBar.planDetails?.jobApplications}/<span className="font-bold">5</span>
          </span>
        );

      case "Messages":
        if (isPremium)
          return (
            <span className="text-sm text-yellow-600 dark:text-yellow-500 font-semibold">
              Unlimited
            </span>
          );
        return (
          <span className={`${getColor(sideBar?.planDetails?.messagesCount, 10)} text-sm`}>
            {sideBar?.planDetails?.messagesCount}/<span className="font-bold">10</span>
          </span>
        );

      case "Plan Expiry Date":
        if (isPremium) {
          if (isExpired) {
            return (
              <span className="text-red-500 dark:text-red-400 text-sm font-bold">Expired</span>
            );
          }
          return (
            <span className="text-green-500 dark:text-green-400 text-sm font-bold">
              {sideBar.planDetails?.expiryDate}
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
    <>
    <LeftSidebarPresentation
      sideBar={sideBar}
      navigateTo={handleNavigation}
      trackedStats={trackedStats}
      determineStat={determineStat}
    />
    {addButton && <PostButton userInfo={sideBar}/>}
    </>
  );
}

export default LeftSidebar;
