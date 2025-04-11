"use client";

// TODO: Implement Multiple Images Case
import { Post } from "./components/modules/feed/Post";
import { useState } from "react";
import LeftSidebar from "./components/modules/feed/container/LeftSidebar";
import RightSidebarPresentation from "./components/modules/feed/presentation/RightSidebarPresentation";
import PostButton from "./components/modules/feed/container/PostButton";
import PostsContainer from "./components/modules/feed/container/PostsContainer";


export default function Page() {
  return (
    <div className="w-full overflow-y-auto">
      <div className="gap-4 px-4 md:px-16 pt-8 flex">
        <div className="hidden md:flex flex-1 rounded-lg flex-col gap-2 items-center">
          <LeftSidebar addButton />
        </div>
        <div className="w-full md:flex-[2_1_0] flex flex-col md:mx-8 rounded-lg">
          <PostsContainer />
        </div>
        <div className="hidden md:block flex-1 space-y-2 drop-shadow-lg">
          <RightSidebarPresentation />
        </div>


      </div>
    </div>
  );
}
