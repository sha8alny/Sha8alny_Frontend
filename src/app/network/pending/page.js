"use client";

import NetworkLayout from "@/app/components/modules/network/NetworkLayout";
import PendingContainer from "@/app/components/modules/network/container/PendingContainer";


export default function PendingPage() {
  return (
    <NetworkLayout activeContent="pending">
      <PendingContainer />
    </NetworkLayout>
  );
}