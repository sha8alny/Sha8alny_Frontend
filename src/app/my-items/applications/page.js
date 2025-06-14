"use client";

import MyItemsLayout from "@/app/components/modules/my-items/layout/MyItemsLayout";
import MyJobsContainer from "@/app/components/modules/my-items/container/MyJobsContainer";


export default function ApplicationsPage() {
  return (
    <MyItemsLayout activeContent="applications">
      <MyJobsContainer />
    </MyItemsLayout>
  );
}