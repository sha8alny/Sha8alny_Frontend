"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, getCommentReplies } from "@/app/services/post";
import { useMutation } from "@tanstack/react-query";
import CommentSectionPresentation from "../presentation/CommentSectionPresentation";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CommentSectionContainer({ username, postId }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentPath = usePathname();

  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await getCommentReplies(postId, null, pageParam);
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
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const comments =
    data?.pages?.flatMap((page) =>
      Array.isArray(page.data) ? page.data : []
    ) || [];

  const isLoading = isLoadingComments && !isFetchingNextPage;
  const hasMore = hasNextPage && !isLoadingComments;

  useEffect(() => {
    const initialLoad =
      typeof window !== "undefined" &&
      !sessionStorage.getItem(`loaded-comments-${postId}`);

    if (initialLoad) {
      sessionStorage.setItem(`loaded-comments-${postId}`, "true");
    }
  }, [postId]);

  const loadMore = () => {
    if (hasMore) {
      fetchNextPage();
    }
  };

  const handleCommentMutation = useMutation({
    mutationFn: (params) =>
      addComment({
        postId: params.postId,
        commentId: params.commentId,
        text: params.comment,
        tags: [],
      }),
    onSuccess: () => {
      setComment("");
      setError(null);
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const navigateTo = () => {
    router.push(`/u/${username}/post/${postId}`);
  };

  const isPost = currentPath.includes("/post/");

  const isSubmittingComment = handleCommentMutation.isLoading;

  const handleComment = () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    handleCommentMutation.mutate({
      postId,
      commentId: null,
      comment: comment.trim(),
    });
  };

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
      postId={postId}
      navigateTo={navigateTo}
      isPost={isPost}
      isLoading={isLoading}
      isLoadingComments={isFetchingNextPage}
    />
  );
}
