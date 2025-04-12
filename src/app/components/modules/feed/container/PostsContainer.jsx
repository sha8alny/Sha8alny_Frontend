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
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }
      
      if (lastPage.posts && lastPage.posts.length > 0) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
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
          rootMargin: "100px"
        }
      );
      
      if (node) {
        console.log("Observing new last element");
        observerRef.current.observe(node);
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const allPosts = data?.pages ? 
    data.pages.flatMap(page => {
      if (page.posts) return page.posts;
      if (Array.isArray(page)) return page;
      return [];
    }) : 
    [];
    
  if (isLoading) {
    return <PostSkeleton />;
  }
  
  if (isError) {
    console.error("Error loading posts:", error);
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
