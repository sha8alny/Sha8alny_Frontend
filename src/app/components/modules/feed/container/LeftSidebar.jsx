"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CalendarMonth, Group, Message, Work } from "@mui/icons-material";
import LeftSidebarPresentation, { LeftSidebarPresentationSkeleton } from "../presentation/LeftSidebarPresentation";
import { fetchSidebarInfo } from "@/app/services/fetchSideBarInfo";
import PostButton from "./PostButton";

/**
 * LeftSidebar - Container component for the application's left sidebar
 * 
 * This component displays user information and subscription plan details including:
 * - User profile summary (name, headline, profile picture)
 * - Plan usage statistics (connections, job applications, messages)
 * - Plan expiry information with color-coded status indicators
 * - Optional post creation button
 * 
 * The component handles data fetching, loading states, error conditions,
 * and calculates visual indicators based on usage limits and premium status.
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.addButton=false] - Whether to show the post creation button
 * @returns {JSX.Element} Sidebar with user info and subscription details or loading skeleton
 */
function LeftSidebar({ addButton = false }) {
  const router = useRouter();

  /**
   * Fetch user and subscription information with React Query
   * Uses a 30-minute cache to reduce unnecessary API calls
   */
  const {
    data: sideBar,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sidebarInfo"],
    queryFn: () => fetchSidebarInfo(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  /**
   * Navigation handler for sidebar links
   * @param {string} path - Path to navigate to
   */
  const handleNavigation = (path) => {
    router.push(path);
  };

  // Show loading skeleton during data fetch
  if (isLoading) {
    return <LeftSidebarPresentationSkeleton />;
  }

  // Show error skeleton if data fetch fails
  if (isError || !sideBar) {
    return <LeftSidebarPresentationSkeleton isLoading={isLoading} />;
  }

  // Configuration for tracked subscription statistics
  const trackedStats = [
    { name: "Connections", icon: Group },
    { name: "Job Applications", icon: Work },
    { name: "Messages", icon: Message },
    { name: "Plan Expiry Date", icon: CalendarMonth },
  ];

  // Determine plan status
  const isExpired = new Date(sideBar?.planDetails?.expiryDate) < new Date();
  const isPremium = sideBar?.planDetails?.isPremium;

  /**
   * Determines the display format and color for a given statistic
   * - Shows "Unlimited" for premium users where appropriate
   * - Uses color coding based on usage percentage for free plan limits
   * - Handles special cases like expiry dates
   * 
   * @param {Object} stat - Statistic object containing name and icon
   * @returns {JSX.Element} Formatted display of the statistic value
   */
  const determineStat = (stat) => {
    /**
     * Calculates color based on usage percentage
     * @param {number} value - Current usage value
     * @param {number} limit - Maximum allowed value
     * @returns {string} Tailwind CSS color class
     */
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
          <span className={`${getColor(sideBar?.planDetails?.messagesCount, 5)} text-sm`}>
            {sideBar?.planDetails?.messagesCount}/<span className="font-bold">5</span>
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
              {sideBar.planDetails?.expiryDate || "N/A"}
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
