"use client";
import { getPosts, getProfilePosts, getSavedPosts } from "@/app/services/post";
import { searchPosts } from "@/app/services/search";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import PostsPresentation from "../presentation/PostsPresentation";
import { PostSkeleton } from "../presentation/PostPresentation";

/**
 * PostsContainer - Container component for displaying paginated post feeds
 * 
 * This component handles fetching and displaying post feeds with infinite scrolling,
 * supporting multiple data sources based on the provided props:
 * - Main feed (default)
 * - Company-specific posts
 * - Keyword search results
 * 
 * Features:
 * - Infinite scrolling with Intersection Observer API
 * - Automatic pagination handling with React Query
 * - Loading states with skeletons
 * - Empty state and error handling
 * - End-of-feed indicator when all posts are loaded
 * 
 * @param {Object} props - Component props
 * @param {string|null} [props.companyUsername=null] - Username of company to fetch posts for
 * @param {string} [props.keyword] - Search keyword for filtering posts
 * @returns {JSX.Element} Infinite scrolling post feed with appropriate states
 */
function PostsContainer({ companyUsername = null, keyword }) {
  // Reference for the intersection observer used in infinite scrolling
  const observerRef = useRef(null);

  /**
   * Infinite query hook for fetching paginated posts
   * - Uses different endpoint based on props (company posts, search, or main feed)
   * - Configures aggressive refetch behavior to ensure fresh content
   * - Handles pagination parameters automatically
   */
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: companyUsername
      ? ["posts", companyUsername]
      : keyword
      ? ["posts", "search", keyword]
      : ["posts"],
    queryFn: ({ pageParam = 1 }) => {
      if (companyUsername) {
        return getProfilePosts(pageParam, companyUsername, true);
      } else if (keyword) {
        return searchPosts(keyword, pageParam);
      } else {
        return getPosts(pageParam);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }

      if (lastPage?.posts && lastPage?.posts?.length > 0) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 0, 
    refetchOnMount: "always", 
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0,
    refetchInterval: false,
    gcTime: 0, 
  });

  /**
   * Callback ref for the last post element to enable infinite scrolling
   * Creates and manages an IntersectionObserver to detect when user scrolls
   * near the bottom of the list, triggering the next page fetch
   * 
   * @param {HTMLElement} node - The DOM node of the last post element
   */
  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage) {
            console.log("Last element is intersecting, loading more posts");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      if (node) {
        console.log("Observing new last element");
        observerRef.current.observe(node);
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  /**
   * Process and normalize posts data from different response formats
   * Handles both array responses and objects with posts property
   */
  const allPosts = data?.pages
    ? data.pages.flatMap((page) => {
        if (page?.posts) return page.posts;
        if (Array.isArray(page)) return page;
        return [];
      })
    : [];

  // Show loading state
  if (isLoading) {
    return <PostSkeleton />;
  }

  // Show error or empty state
  if (isError || (allPosts.length == 0)) {
    return (
      <div className="flex flex-col justify-center items-center py-8 mb-8">
          <div className="w-full max-w-2xl border-border pt-6 mt-2">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-lg text-primary font-semibold mb-1">No posts to show.</div>
              <p className="text-muted-foreground text-sm">
                No posts were found matching your search criteria.
              </p>
            </div>
          </div>
        </div>
    );
  }

  return (
    <>
      <PostsPresentation
        posts={allPosts}
        isFetchingNextPage={isFetchingNextPage}
        lastElementRef={lastElementRef}
      />
      
      {/* End of feed indicator - shown when all posts have been loaded */}
      {!hasNextPage && !isFetchingNextPage && allPosts.length > 0 && (
        <div className="flex flex-col justify-center items-center py-4 mb-8">
          <div className="w-full max-w-2xl border-t-2 border-primary/20 pt-6 mt-2">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-lg text-primary font-semibold mb-1">You're all caught up!</div>
              <p className="text-muted-foreground text-sm">
                You've seen all the posts in your feed.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostsContainer;
