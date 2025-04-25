"use client";
import { getProfilePosts } from "@/app/services/post";
import { useQuery } from "@tanstack/react-query";
import PostsPresentation from "../presentation/PostsPresentation";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function PostsContainer({ username }) {
  const router = useRouter();
  const carouselRef = useRef(null);
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getProfilePosts(1, username, false),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const navigateTo = (path) => {
    router.push(path);
    window.location.reload();
  };

  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
    return videoExtensions.some((ext) => mediaUrl.endsWith(ext));
  };

  const isDocument = (mediaUrl) => {
    if (!mediaUrl) return false;
    const documentExtensions = [".pdf", ".doc", ".docx"];
    return documentExtensions.some((ext) => mediaUrl.endsWith(ext));
  };

  const carouselScroll = (index) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / posts.length;
      carouselRef.current.scrollLeft = itemWidth * index;
    }
  };

  const filteredPosts = posts?.filter((post) => {
    return post?.isShared === null || (post?.isShared !== null && post?.username !== post?.isShared?.username);
  });

  return (
    <PostsPresentation
      posts={filteredPosts}
      isLoading={isLoading}
      isError={isError}
      navigateTo={navigateTo}
      isVideo={isVideo}
      isDocument={isDocument}
      carouselRef={carouselRef}
      carouselScroll={carouselScroll}
    />
  );
}
