"use client";

import Link from "next/link";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GroupsIcon from '@mui/icons-material/Groups';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SuggestedUsersContainer from "../profile/container/SuggestedUsersContainer";
import  SuggestedUsersSkeleton  from "../../layout/SuggestedUsers";
import NetworkFilterContainer from "./container/NetworkFiltersContainer";
import { useState }  from "react";
import React from "react";

const NetworkLayout = ({ children, activeContent }) => {
  const isActive = (path) => activeContent === path;
  const [filteredResults, setFilteredResults] = useState(null);

  return (
    <>
      <div className="container mx-auto py-6 px-0">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 order-first">
            <div className="w-full shadow-2xl bg-foreground rounded-2xl p-4">
              <h2 className="text-xl font-bold text-text mb-6 px-4">
               My Network
              </h2>
              <nav className="space-y-1">
                <Link
                  data-testid="connections-tab"
                  href="/network/connections"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("connections")
                      ? "bg-blue-100 text-secondary dark:bg-secondary dark:text-primary"
                      : "text-gray-700 hover:bg-primary/10 dark:text-gray-300 dark:hover:bg-background/30"
                  }`}
                >
                  <Diversity3Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Connections</span>
                </Link>

                <Link
                  data-testid="follow-tab"
                  href="/network/followers-followings"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("followers&followings")
                      ? "bg-blue-100 text-secondary dark:bg-secondary dark:text-primary"
                      : "text-gray-700 hover:bg-primary/10 dark:text-gray-300 dark:hover:bg-background/30"
                  }`}
                >
                  <ConnectWithoutContactIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Followers & Following</span>
                </Link>
                <Link
                  data-testid="pending-tab"
                  href="/network/pending"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("pending")
                      ? "bg-blue-100 text-secondary dark:bg-secondary dark:text-primary"
                      : "text-gray-700 hover:bg-primary/10 dark:text-gray-300 dark:hover:bg-background/30"
                  }`}
                >
                  <HourglassBottomIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Pending Requests</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full h-full md:w-3/4 mx-auto">{children}</div>
          {/* Right Sidebar */}
          <div className="w-full md:w-1/4 order-last ">
          <div className="w-full flex flex-col gap-4">
            <NetworkFilterContainer activeTab={activeContent} onResults={setFilteredResults}/>

            {/* <SuggestedUsersSkeleton /> */}
            <SuggestedUsersContainer title="People You May Know" />
            {/* <SuggestedUsersSkeleton /> */}
            </div>
            </div>
            </div>
        </div>
    </>
  );
};

export default NetworkLayout;
