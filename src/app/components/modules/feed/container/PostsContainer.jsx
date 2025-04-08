"use client";
import { getPosts } from "@/app/services/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import PostsPresentation from "../presentation/PostsPresentation";
import { PostSkeleton } from "../presentation/PostPresentation";

function PostsContainer() {
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
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages to fetch
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create a callback ref that we'll pass to the last element
  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Handle the API response format - the posts are directly in the response
  const allPosts = data?.pages ? 
    data.pages.flatMap(page => Array.isArray(page) ? page : []) : 
    [];

  if (isLoading) {
    return <PostSkeleton />;
  }
  
  if (isError) {
    return <div className="flex justify-center items-center h-full text-muted">No posts to show.</div>;
  }

  return (
    <PostsPresentation
      posts={allPosts}
      isFetchingNextPage={isFetchingNextPage}
      lastElementRef={lastElementRef}
    />
  );
}

export default PostsContainer;
