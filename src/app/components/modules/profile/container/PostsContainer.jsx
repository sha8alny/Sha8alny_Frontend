"use client";
import { getProfilePosts } from "@/app/services/post";
import { useQuery } from "@tanstack/react-query";
import PostsPresentation from "../presentation/PostsPresentation";
import { useRouter } from "next/navigation";
import { useRef } from "react";

/**
 * PostsContainer - Container component for displaying a user's profile posts
 * 
 * This component fetches and prepares posts data for the presentation layer,
 * managing post filtering, navigation, media type detection, and carousel functionality.
 * 
 * @param {Object} props - Component props
 * @param {string} props.username - Username of the profile owner
 * @returns {JSX.Element} PostsPresentation component with all necessary props
 */
export default function PostsContainer({ username }) {
  const router = useRouter();
  const carouselRef = useRef(null);
  
  // Fetch posts for the specified username
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

  /**
   * Navigate to a specified path using Next.js router
   * @param {string} path - Path to navigate to
   */
  const navigateTo = (path) => {
    router.push(path);
  };

  /**
   * Check if a media URL is a video file
   * @param {string} mediaUrl - URL of the media file
   * @returns {boolean} True if the file is a video, false otherwise
   */
  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
    return videoExtensions.some((ext) => mediaUrl.endsWith(ext));
  };

  /**
   * Check if a media URL is a document file
   * @param {string} mediaUrl - URL of the media file
   * @returns {boolean} True if the file is a document, false otherwise
   */
  const isDocument = (mediaUrl) => {
    if (!mediaUrl) return false;
    const documentExtensions = [".pdf", ".doc", ".docx"];
    return documentExtensions.some((ext) => mediaUrl.endsWith(ext));
  };

  /**
   * Scroll the carousel to show a specific post
   * @param {number} index - Index of the post to scroll to
   */
  const carouselScroll = (index) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / posts.length;
      carouselRef.current.scrollLeft = itemWidth * index;
    }
  };

  /**
   * Filter out duplicate shared posts where the user shares their own post
   * This prevents showing the same content twice on a user's profile
   * 
   * @returns {Array} Filtered array of posts without self-shared duplicates
   */
  const filteredPosts = posts?.filter((post) => {
    return post?.isShared === null || (post?.isShared !== null && post?.username !== post?.isShared?.username);
  });

  return (
    <PostsPresentation
      posts={filteredPosts}      // Filtered posts array without self-shared duplicates
      isLoading={isLoading}      // Loading state from the query
      isError={isError}          // Error state from the query
      navigateTo={navigateTo}    // Function to navigate to different pages
      isVideo={isVideo}          // Function to check if a media file is a video
      isDocument={isDocument}    // Function to check if a media file is a document
      carouselRef={carouselRef}  // Ref for the carousel element
      carouselScroll={carouselScroll} // Function to scroll the carousel
    />
  );
}
