"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import ConnectionsContainer from "@/app/components/modules/network/container/ConnectionsContainer";
import { FilterProvider } from "@/app/context/NetworkFilterContext";

export default function ConnectionsPage() {
  return (
    <FilterProvider>
    <NetworkLayout activeContent="connections">
      <ConnectionsContainer />
    </NetworkLayout>
    </FilterProvider>
  );
}