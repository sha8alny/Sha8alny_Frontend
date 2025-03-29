"use client";

import Link from "next/link";
import Navbar from "../../../layout/NavBar";
import {
  Work as JobsIcon,
  Bookmark as SavedIcon,
  Description as PostsIcon,
} from "@mui/icons-material";

/**
 * @namespace my-items
 * @module my-items
 */
/**
 * MyItemsLayout component renders a layout with a sidebar and main content area.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The main content to display in the layout.
 * @param {string} props.activeContent - The active content identifier to highlight the corresponding menu item.
 * @returns {JSX.Element} The rendered layout component.
 */
const MyItemsLayout = ({ children, activeContent }) => {
  const isActive = (path) => activeContent === path;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 order-first">
            <div className="w-full shadow-2xl bg-foreground rounded-2xl p-4">
              <h2 className="text-xl font-bold text-text mb-6 px-4">
                My Items
              </h2>
              <nav className="space-y-1">
                <Link
                  href="/my-items/applications"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("applications")
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <JobsIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">My Applications</span>
                </Link>

                <Link
                  href="/my-items/saved-jobs"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("saved-jobs")
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <SavedIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Saved Jobs</span>
                </Link>

                <Link
                  href="/my-items/saved-posts"
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive("saved-posts")
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <PostsIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Saved Posts</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full h-full md:w-3/4 mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default MyItemsLayout;
