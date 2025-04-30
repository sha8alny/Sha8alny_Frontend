"use client";
import { getPosts, getProfilePosts, getSavedPosts } from "@/app/services/post";
import { searchPosts } from "@/app/services/search";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import PostsPresentation from "../presentation/PostsPresentation";
import { PostSkeleton } from "../presentation/PostPresentation";


function PostsContainer({ companyUsername = null , keyword }) {
  const observerRef = useRef(null);

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


  const allPosts = data?.pages
    ? data.pages.flatMap((page) => {
        if (page?.posts) return page.posts;
        if (Array.isArray(page)) return page;
        return [];
      })
    : [];

  if (isLoading) {
    return <PostSkeleton />;
  }
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
      
      {!hasNextPage && !isFetchingNextPage && !allPosts.length > 0 && (
        <div className="flex flex-col justify-center items-center py-8 mb-8">
          <div className="w-full max-w-2xl border-t border-border pt-6 mt-2">
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
