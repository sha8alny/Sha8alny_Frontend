
"use client";

import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MembershipPageLayout from "./MembershipPageLayout";
/**
 * @namespace membership
 * @module membership
 */
/**
 * MembershipStatusSkeleton Component
 *
 * This component serves as a skeleton loader for the membership status page.
 * It provides a placeholder UI while the actual data is being loaded.
 *
 * @component
 * @returns {JSX.Element} The rendered skeleton loader for the membership status page.
 *
 */

const MembershipStatusSkeleton = () => {
  return (
     <MembershipPageLayout>
          <div className="flex p-4 flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
    <div className="mx-auto flex bg-foreground w-full max-w-[725px] p-4 rounded-2xl shadow-2xl animate-pulse">
      <div className="w-full">
        <h1 className="flex items-center gap-2 text-primary text-xl font-semibold text-center md:text-left">
          Your current plan:{" "}
          <span className="bg-gray-600 rounded w-100 h-6 inline-block"></span>
        </h1>

        <div className="flex flex-col md:flex-row justify-between mt-2 text-lg">
          <div className="flex flex-col gap-2 p-2 md:w-1/2">
            <div className="flex items-center gap-2">
              <GroupsIcon className="mb-1 text-gray-400" />
              <span className="bg-gray-600 rounded w-50 h-6 inline-block"></span>
            </div>
            <div className="flex items-center gap-2">
              <ChatIcon className="text-gray-400" />
              <span className="bg-gray-600 rounded w-50 h-6 inline-block"></span>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:w-1/2 text-right p-2 md:text-left">
            <div className="flex items-center gap-2">
              <BusinessCenterIcon className="text-gray-400" />
              <span className="bg-gray-600 rounded w-50 h-6 inline-block"></span>
            </div>
            <div className="flex gap-2">
              <CalendarMonthIcon className="text-gray-400" />
              <span className="bg-gray-600 rounded w-50 h-6 inline-block"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MembershipPageLayout>
  );
};

export default MembershipStatusSkeleton;
