"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import FollowersAndFollowingsContainer from "@/app/components/modules/network/container/FollowersAndFollowingsContainer";
import { FilterProvider } from "@/app/context/NetworkFilterContext";


export default function FollowersAndFollowingsPage() {
  return (
    <FilterProvider>
    <NetworkLayout activeContent="followers&followings">
      <FollowersAndFollowingsContainer />
    </NetworkLayout>
    </FilterProvider>
  );
}