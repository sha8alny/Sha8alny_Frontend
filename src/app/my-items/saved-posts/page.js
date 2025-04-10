"use client";
import SavedPostsContainer from "@/app/components/modules/my-items/container/SavedPostsContainer";
//////////////////////////////PLACEHOLDER////////////////////////////////
import MyItemsLayout from "@/app/components/modules/my-items/layout/MyItemsLayout";

export default function SavedPostsPage() {
  return (
    <MyItemsLayout activeContent="saved-posts">
    <SavedPostsContainer />
    </MyItemsLayout>
  );
}
