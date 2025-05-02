"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import PendingContainer from "@/app/components/modules/network/container/PendingContainer";
import { FilterProvider } from "@/app/context/NetworkFilterContext";


export default function PendingPage() {
  return (
    <FilterProvider>
    <NetworkLayout activeContent="pending">
      <PendingContainer />
    </NetworkLayout>
    </FilterProvider>
  );
}