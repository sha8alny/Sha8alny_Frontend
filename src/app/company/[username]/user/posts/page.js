"use client";
import PostsContainer from "@/app/components/modules/feed/container/PostsContainer";
import CompanyFollowersContainer from "@/app/components/modules/company-page-user/container/CompanyFollowersContainer";
import { useParams } from "next/navigation";

export default function Posts() {
  const { username } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Company info */}
        <div className="hidden lg:block w-full lg:w-55 xl:w-72">
          <CompanyFollowersContainer username={username} />
        </div>

        {/* Posts */}
        <div className="flex-1">
          <PostsContainer companyUsername={username} />
        </div>
      </div>
    </div>
);
}
