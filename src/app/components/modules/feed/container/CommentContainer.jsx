"use client";
import {
  reactToContent,
  getCommentReplies,
  addComment,
  determineAge,
} from "@/app/services/post";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CommentPresentation from "../presentation/CommentPresentation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { followUser } from "@/app/services/connectionManagement";
import { Reactions } from "@/app/utils/Reactions";


export default function CommentContainer({ postId, comment }) {
  const [isLiked, setIsLiked] = useState(comment?.reaction || false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data,
    isLoading: isLoadingReplies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["commentReplies", postId, comment?.commentId],
    queryFn: ({ pageParam = 1 }) =>
      getCommentReplies(postId, comment?.commentId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
    enabled: !!comment?.commentId && !comment.isReply, // Only fetch if we have a commentId and it's not a reply itself
  });

  const displayedReplies = data?.pages.flatMap(page => Array.isArray(page) ? page : []) || [];

  const loadMoreReplies = () => {
    fetchNextPage();
  };

  const navigateTo = (username) => {
    router.push(`/u/${username}`);
  };

  const handleFollowMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const handleReactMutation = useMutation({
    mutationFn: reactToContent,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      console.error("Error reacting to comment:", error);
    },
  });

  const handleCommentMutation = useMutation({
    mutationFn: (params) => addComment({
      postId: params.postId,
      commentId: params.commentId,
      text: params.text,
      tags: params.tags || [],
    }),
    onSuccess: () => {
      // Invalidate both the comments query and the comment replies query
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries(["commentReplies", postId, comment?.commentId]);
      setReplyText("");
      setIsReplying(false);
    },
    onError: (error) => {
      console.error("Error adding comment/reply:", error);
    },
  });

  const handleLike = (reaction = "Like") => {
    handleReactMutation.mutate({
      postId,
      commentId: comment?.commentId,
      reaction: reaction,
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;

    handleCommentMutation.mutate({
      postId,
      commentId: comment?.commentId,
      text: replyText.trim(),
      tags: [],
    });
  };

  const handleFollow = (username) => {
    handleFollowMutation.mutate(username);
  };

  const commentAge = determineAge(comment?.time || new Date());
  const hasRepliesSection =
    !comment.isReply && (displayedReplies?.length > 0 || isLoadingReplies);

  return (
    <CommentPresentation
      comment={{
        ...comment,
        age: commentAge,
      }}
      isLiked={isLiked}
      onLike={handleLike}
      onReply={handleReply}
      navigateTo={navigateTo}
      postId={postId}
      displayedReplies={displayedReplies}
      isLoadingReplies={isLoadingReplies}
      hasMoreReplies={hasNextPage}
      isFetchingMoreReplies={isFetchingNextPage}
      loadMoreReplies={loadMoreReplies}
      isReplying={isReplying}
      setIsReplying={setIsReplying}
      replyText={replyText}
      setReplyText={setReplyText}
      onFollow={handleFollow}
      hasRepliesSection={displayedReplies?.length > 0 || hasRepliesSection}
      userReactions={Reactions}
    />
  );
}
