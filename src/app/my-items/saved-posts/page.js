"use client";
//////////////////////////////PLACEHOLDER////////////////////////////////
import MyItemsLayout from "@/app/components/layout/MyItemsLayout";

export default function SavedPostsPage() {
  return (
    <MyItemsLayout activeContent="saved-posts">
      <div className="p-4 rounded-2xl shadow-2xl bg-foreground px-8 h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Saved Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Articles and posts you've bookmarked
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Browse Feed
            </button>
          </div>
        </div>

        <div className="bg-background rounded-xl p-6 text-center">
          <div className="text-gray-500 mb-4">
            You haven't saved any posts yet
          </div>
          <p className="text-gray-600 mb-4">
            Save interesting articles, tutorials and industry news to read later
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Explore Posts
          </button>
        </div>
      </div>
    </MyItemsLayout>
  );
}
