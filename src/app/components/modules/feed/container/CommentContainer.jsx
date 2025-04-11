"use client";
import {
  reactToContent,
  getCommentReplies,
  addComment,
  determineAge,
  deleteComment,
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
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await getCommentReplies(
          postId,
          comment?.commentId,
          pageParam
        );
        return { data: result, pageParam };
      } catch (error) {
        if (error.response?.status === 404) {
          return { data: [], pageParam, noMoreData: true };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.noMoreData) {
        return undefined;
      }

      const data = lastPage.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return undefined;
      }

      const perPage = 5;
      return data.length === perPage ? lastPage.pageParam + 1 : undefined;
    },
    enabled: !!comment?.commentId && showReplies,
  });

  const displayedReplies =
    data?.pages.flatMap((page) =>
      Array.isArray(page.data) ? page.data : []
    ) || [];

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
      queryClient.invalidateQueries([
        "commentReplies",
        postId,
        comment?.commentId,
      ]);
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const handleReactMutation = useMutation({
    mutationFn: (params) => {
      const { postId, commentId, reaction } = params;
      return isLiked && comment?.reaction === reaction
        ? reactToContent(postId, commentId, null, true)
        : reactToContent(postId, commentId, reaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleCommentMutation = useMutation({
    mutationFn: (params) =>
      addComment({
        postId: params.postId,
        commentId: params.commentId,
        text: params.text,
        tags: params.tags || [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries([
        "commentReplies",
        postId,
        comment?.commentId,
      ]);
      setReplyText("");
      setIsReplying(false);
    },
    onError: (error) => {
      console.error("Error adding comment/reply:", error);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (params) => {
      const { postId, commentId } = params;
      return deleteComment(postId, commentId);
    },
    onMutate: () => {
      setIsDeleting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries([
        "commentReplies",
        postId,
        comment?.commentId,
      ]);
    },
    onSettled: () => {
      setIsDeleting(false);
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

  const handleDelete = () => {
    handleDeleteMutation.mutate({
      postId,
      commentId: comment?.commentId,
    });
  };

  const handleShowReplies = () => {
    setShowReplies(true);
  };

  const handleHideReplies = () => {
    setShowReplies(false);
  };

  const commentAge = determineAge(comment?.time || new Date());
  const hasRepliesSection = showReplies;
  const hasReplies = comment?.numComments > 0;

  return (
    <CommentPresentation
      comment={{
        ...comment,
        age: commentAge,
        numReacts:
          (comment?.numLikes || 0) +
          (comment?.numCelebrates || 0) +
          (comment?.numLoves || 0) +
          (comment?.numSupports || 0) +
          (comment?.numFunnies || 0) +
          (comment?.numInsightfuls || 0),
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
      hasRepliesSection={hasRepliesSection}
      userReactions={Reactions}
      showMoreButtonText="Show more replies"
      showReplies={showReplies}
      onShowReplies={handleShowReplies}
      onHideReplies={handleHideReplies}
      onDelete={handleDelete}
      hasReplies={hasReplies}
      isDeleting={isDeleting}
    />
  );
}
