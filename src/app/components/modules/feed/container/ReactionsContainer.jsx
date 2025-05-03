"use client";
import { useState, useRef, useEffect } from "react";
import { fetchReactions } from "@/app/services/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import Dialog from "@/app/components/ui/DialogMod";
import ReactionsPresentation from "../presentation/ReactionsPresentation";
import { Reactions } from "@/app/utils/Reactions";

export default function ReactionsContainer({
  numReactions,
  allReactions,
  postId,
  commentId = null, // Add commentId with default value
}) {
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionModalOpen, setReactionModalOpen] = useState(false);
  const loadMoreRef = useRef(null);

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

  const handleReactionChange = (reactionName) => {
    setCurrentReaction(reactionName === "all" ? null : reactionName);
  };

  const users = data?.pages.flatMap((page) => page) || [];

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
