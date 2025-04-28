"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import ConnectionsContainer from "@/app/components/modules/network/container/ConnectionsContainer";

export default function ConnectionsPage() {
  return (
    <NetworkLayout activeContent="connections">
      <ConnectionsContainer />
    </NetworkLayout>
  );
}