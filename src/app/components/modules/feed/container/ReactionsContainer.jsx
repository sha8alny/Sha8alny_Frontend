"use client";
import { useState, useRef, useEffect } from "react";
import { fetchReactions } from "@/app/services/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import Dialog from "@/app/components/ui/DialogMod";
import ReactionsPresentation from "../presentation/ReactionsPresentation";
import { Reactions } from "@/app/utils/Reactions";

/**
 * ReactionsContainer - Container component for displaying post/comment reactions
 * 
 * This component handles fetching, filtering, and displaying user reactions on posts or comments.
 * Features include:
 * - Modal dialog to display reactions
 * - Filtering reactions by type (Like, Love, etc.)
 * - Infinite scrolling to load additional reactions
 * - Visual indication of reaction types and counts
 * 
 * The component serves as both the trigger for opening the reactions modal
 * and the container for the reactions display content.
 * 
 * @param {Object} props - Component props
 * @param {number} props.numReactions - Total number of reactions
 * @param {Object} props.allReactions - Categorized reactions data 
 * @param {Array} props.allReactions.topReactions - Top reactions with icon components
 * @param {Array} props.allReactions.allActive - All active reaction types
 * @param {string} props.postId - ID of the post with reactions
 * @param {string|null} [props.commentId=null] - ID of comment with reactions (if applicable)
 * @returns {JSX.Element} Reactions display component with modal functionality
 */
export default function ReactionsContainer({
  numReactions,
  allReactions,
  postId,
  commentId = null,
}) {
  // Track currently selected reaction filter
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionModalOpen, setReactionModalOpen] = useState(false);
  const loadMoreRef = useRef(null);

  /**
   * Infinite query for fetching paginated reactions with optional type filtering
   * Only enabled when the reactions modal is open to prevent unnecessary requests
   */
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["postReactions", postId, commentId, currentReaction],
    queryFn: ({ pageParam = 1 }) =>
      fetchReactions(postId, commentId, pageParam, currentReaction),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0,
    refetchInterval: false,
    gcTime: 0,
    enabled: reactionModalOpen,
  });

  /**
   * Sets up intersection observer for infinite scrolling of reactions
   * Automatically fetches the next page when the user scrolls to the bottom
   */
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    reactionModalOpen,
  ]);

  /**
   * Handles switching between different reaction filters
   * @param {string} reactionName - The name of the reaction to filter by, or "all" to show all
   */
  const handleReactionChange = (reactionName) => {
    setCurrentReaction(reactionName === "all" ? null : reactionName);
  };

  // Process and flatten the reactions data from all pages
  const users = data?.pages.flatMap((page) => page) || [];

  /**
   * Transform reaction data to include proper icon components
   * Maps string reaction types to their corresponding icon components
   */
  const correctedUsers = users.map((user) => ({
    ...user,
    reaction: Reactions[user.reaction].icon,
  }));

  return (
    <Dialog
      open={reactionModalOpen}
      onOpenChange={setReactionModalOpen}
      buttonClass="group cursor-pointer flex items-center gap-1"
      useRegularButton
      buttonData={
        <div className="flex items-center gap-0">
          {allReactions?.topReactions?.map((reaction, index) => (
            <span key={index}>
              <reaction.icon size="1.2rem" />
            </span>
          ))}
          <span className="ml-1 group-hover:underline text-sm text-muted cursor-pointer">
            {numReactions}
          </span>
        </div>
      }
      AlertContent={
        <ReactionsPresentation
          reactions={allReactions}
          currentReaction={currentReaction}
          setCurrentReaction={setCurrentReaction}
          users={correctedUsers}
          isLoading={isLoading && !isFetchingNextPage}
          isLoadingMore={isFetchingNextPage}
          isError={isError}
          hasNextPage={hasNextPage}
          numReactions={numReactions}
          loadMoreRef={loadMoreRef}
          activeReactions={allReactions?.allActive || []}
          handleReactionChange={handleReactionChange}
        />
      }
    />
  );
}
