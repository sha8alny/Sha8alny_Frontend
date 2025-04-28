"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import FollowersAndFollowingsContainer from "@/app/components/modules/network/container/FollowersAndFollowingsContainer";


export default function FollowersAndFollowingsPage() {
  return (
    <NetworkLayout activeContent="followers&followings">
      <FollowersAndFollowingsContainer />
    </NetworkLayout>
  );
}