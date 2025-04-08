"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, getCommentReplies } from "@/app/services/post";
import { useMutation } from "@tanstack/react-query";
import CommentSectionPresentation from "../presentation/CommentSectionPresentation";
import { useState, useEffect } from "react";

export default function CommentSectionContainer({ postId }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  
  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => getCommentReplies(postId, null, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Only return next page if we have data and it's a full page
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0) {
        console.log("No more comments to load or invalid data format.");
        return undefined;
      }
      // Assuming 5 comments per page
      return lastPage.length === 5 ? allPages.length + 1 : undefined;
    },
    staleTime: 60000, // 1 minute
  });
  
  // Ensure proper data formatting from API response
  const comments = data?.pages?.flatMap(page => Array.isArray(page) ? page : []) || [];
  
  const isLoading = isLoadingComments || isFetchingNextPage;
  const hasMore = hasNextPage && !isLoadingComments;
  
  // Force a refetch on initial load to ensure we have the latest data
  useEffect(() => {
    refetch();
  }, [postId, refetch]);
  
  const loadMore = () => {
    if (hasMore) {
      fetchNextPage();
    }
  };

  const handleCommentMutation = useMutation({
    mutationFn: (params) => addComment({
      postId: params.postId,
      commentId: params.commentId,
      text: params.comment,
      tags: []
    }),
    onSuccess: () => {
      setComment("");
      setError(null);
      // Invalidate and refetch comments immediately
      queryClient.invalidateQueries(["comments", postId]);
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (isLoading || isLoadingComments) {
    return <CommentSectionPresentation isLoading={true} />;
  }

  const isSubmittingComment = handleCommentMutation.isLoading;

  const handleComment = () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    
    handleCommentMutation.mutate({
      postId,
      commentId: null,
      comment: comment.trim()
    });
  };

  console.log(data);

  return (
    <CommentSectionPresentation
      comments={comments}
      hasMore={hasMore}
      loadMore={loadMore}
      handleComment={handleComment}
      comment={comment}
      setComment={setComment}
      isSubmittingComment={isSubmittingComment}
      error={error}
    />
  );
}
