"use client";

// TODO: Implement Multiple Images Case
import LeftSidebar from "./components/modules/feed/container/LeftSidebar";
import RightSidebarPresentation from "./components/modules/feed/presentation/RightSidebarPresentation";
import PostsContainer from "./components/modules/feed/container/PostsContainer";

export default function Page() {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="min-h-screen gap-4 px-4 md:px-16 pt-8 flex flex-col md:flex-row">
        <div className="md:flex-1 md:flex flex-col gap-2 items-center">
          <div className="sticky top-8 w-full">
            <LeftSidebar addButton />
          </div>
        </div>
        <div className="w-full md:flex-[2_1_0] flex flex-col md:mx-8 rounded-lg">
          <PostsContainer />
        </div>
        <div className="hidden md:block md:flex-1">
          <div className="sticky top-8 w-full">
            <RightSidebarPresentation />
          </div>
        </div>
      </div>
    </div>
  );
}
