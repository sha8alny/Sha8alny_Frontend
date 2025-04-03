"use client";
import { getPosts } from "@/app/services/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import PostsPresentation from "../presentation/PostsPresentation";

function PostsContainer() {
  const observerRef = useRef(null);
  const [lastElementRef, setLastElementRef] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.5 });

    if (lastElementRef) {
      observerRef.current.observe(lastElementRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lastElementRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <PostsPresentation posts={allPosts} isLoading={isLoading} isError={isError} error={error} />
  );
}

export default PostsContainer;