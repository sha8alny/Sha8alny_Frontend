"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, determineAge, getCommentReplies } from "@/app/services/post";
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
    staleTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: false,
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
    onSuccess: (newComment) => {
      setError(null);
      const oldComment = comment;
      setComment(""); // Clear input field immediately for better UX

      queryClient.setQueryData(["comments", postId], (oldData) => {
        // Create the comment object with all required fields
        const commentObj = {
          commentId: newComment.commentId,
          text: oldComment.trim(),
          username: queryClient.getQueryData(["sidebarInfo"])?.username || "user",
          profilePicture:
            queryClient.getQueryData(["sidebarInfo"])?.profilePicture || "",
          fullName: queryClient.getQueryData(["sidebarInfo"])?.name || "User",
          time: new Date().toISOString(),
          numLikes: 0,
          numCelebrates: 0,
          numLoves: 0,
          numSupports: 0,
          numFunnies: 0,
          numInsightfuls: 0,
          numComments: 0,
          numReacts: 0,
          reaction: null,
          connectionDegree: 0,
          headline: queryClient.getQueryData(["sidebarInfo"])?.headline || "",
          isFollowed: false,
          age: determineAge(new Date()),
        };

        if (!oldData || !oldData.pages || !oldData.pages[0]) {
          return {
            pages: [{ data: [commentObj] }],
            pageParams: [1],
          };
        }

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: Array.isArray(oldData.pages[0].data)
                ? [commentObj, ...oldData.pages[0].data]
                : [commentObj],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });

      // Update the post's comment count
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.map((p) =>
                  p.postId === postId
                    ? { ...p, numComments: (p.numComments || 0) + 1 }
                    : p
                )
              : page
          ),
        };
      });
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const navigateTo = () => {
    router.push(`/u/${username}/post/${postId}`);
  };

  const isPost = currentPath.includes("/post/");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

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
      handleKeyPress={handleKeyPress}
      comment={comment}
      setComment={setComment}
      isSubmittingComment={handleCommentMutation.isPending}
      error={error}
      postId={postId}
      navigateTo={navigateTo}
      isPost={isPost}
      isLoading={isLoading}
      isLoadingComments={isFetchingNextPage}
      postUsername={username}
    />
  );
}
