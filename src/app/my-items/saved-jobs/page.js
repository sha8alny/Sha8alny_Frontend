"use client";

import MyItemsLayout from "@/app/components/layout/MyItemsLayout";
import SavedJobsContainer from "@/app/components/modules/my-items/container/SavedJobsContainer";


export default function SavedJobsPage() {
  return (
    <>
      <MyItemsLayout activeContent="saved-jobs">
        <SavedJobsContainer />
      </MyItemsLayout>
    </>
  );
}
