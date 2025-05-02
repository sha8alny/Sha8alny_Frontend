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
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { followUser } from "@/app/services/connectionManagement";
import { Reactions } from "@/app/utils/Reactions";
import { report } from "@/app/services/privacy";

function updateAncestorCommentCounts(
  queryClient,
  postId,
  parentIdToUpdate,
  delta
) {
  if (!parentIdToUpdate) {
    const updatePostCommentCount = (oldData) => {
      if (!oldData) return oldData;

      if (oldData.pages) {
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.map((p) =>
                  p.postId === postId
                    ? {
                        ...p,
                        numComments: Math.max(0, (p.numComments || 0) + delta),
                      }
                    : p
                )
              : page &&
                typeof page === "object" &&
                "postId" in page &&
                page.postId === postId
              ? {
                  ...page,
                  numComments: Math.max(0, (page.numComments || 0) + delta),
                }
              : page
          ),
        };
      }

      if (oldData.postId === postId) {
        return {
          ...oldData,
          numComments: Math.max(0, (oldData.numComments || 0) + delta),
        };
      }

      return oldData;
    };

    queryClient.setQueryData(["posts"], updatePostCommentCount);
    queryClient.setQueryData(["post", postId], updatePostCommentCount);
    return;
  }

  let parentFoundAndUpdated = false;
  let grandParentId = null;

  const findAndUpdateInPages = (oldData) => {
    if (parentFoundAndUpdated || !oldData?.pages) {
      return oldData;
    }

    let commentFound = false;
    const newPages = oldData.pages.map((page) => {
      if (commentFound || !page || !Array.isArray(page.data)) {
        return page;
      }

      let pageModified = false;
      const newData = page.data.map((comment) => {
        if (comment?.commentId === parentIdToUpdate) {
          commentFound = true;
          parentFoundAndUpdated = true;
          pageModified = true;
          grandParentId = comment.parentId;
          return {
            ...comment,
            numComments: Math.max(0, (comment.numComments || 0) + delta),
          };
        }
        return comment;
      });

      return pageModified ? { ...page, data: newData } : page;
    });

    return commentFound ? { ...oldData, pages: newPages } : oldData;
  };

  queryClient.setQueryData(["comments", postId], findAndUpdateInPages);

  if (!parentFoundAndUpdated) {
    const replyQueryKeys = queryClient.getQueryCache().findAll({
      queryKey: ["commentReplies", postId],
      exact: false,
    });

    for (const query of replyQueryKeys) {
      if (parentFoundAndUpdated) break;
      queryClient.setQueryData(query.queryKey, findAndUpdateInPages);
    }
  }

  if (parentFoundAndUpdated) {
    updateAncestorCommentCounts(queryClient, postId, grandParentId, delta);
  }
}

export default function CommentContainer({
  postId,
  comment,
  postUsername,
  nestCount = 0,
  isSingleComment = false,
}) {
  const [isLiked, setIsLiked] = useState(comment?.reaction || false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteCommentModalOpen, setDeleteModalOpen] = useState(false);
  const [reportCommentModalOpen, setReportCommentModalOpen] = useState(false);
  const [reportState, setReportState] = useState(0);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState(null);
  const [reactAnim, setReactAnim] = useState(false);
  const prevReaction = useRef(isLiked);

  const [reactionCount, setReactionCount] = useState(
    (comment?.numLikes || 0) +
      (comment?.numCelebrates || 0) +
      (comment?.numLoves || 0) +
      (comment?.numSupports || 0) +
      (comment?.numFunnies || 0) +
      (comment?.numInsightfuls || 0)
  );
  const [isFollowing, setIsFollowing] = useState(comment?.isFollowed || false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (comment?.isFollowed !== isFollowing) {
      setIsFollowing(comment?.isFollowed);
    }
  }, [comment?.isFollowed]);

  useEffect(() => {
    if (isLiked && prevReaction.current !== isLiked) {
      setReactAnim(true);
      prevReaction.current = isLiked;
    }
  }, [isLiked]);

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
    staleTime: Infinity,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const displayedReplies =
    data?.pages.flatMap((page) =>
      Array.isArray(page.data) ? page.data : []
    ) || [];

  const navigateTo = (link) => {
    router.push(link);
  };

  const loadMoreReplies = () => {
    fetchNextPage();
  };

  const handleFollowMutation = useMutation({
    mutationFn: (username) => followUser(username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["commentReplies", postId] });

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousComments = queryClient.getQueryData(["comments", postId]);

      const previousFollowingState = isFollowing;
      setIsFollowing(true);

      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.map((p) =>
                  p.username === username ? { ...p, isFollowed: true } : p
                )
              : page
          ),
        };
      });

      queryClient.setQueryData(["comments", postId], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: Array.isArray(page.data)
              ? page.data.map((c) =>
                  c.username === username ? { ...c, isFollowed: true } : c
                )
              : page.data,
          })),
        };
      });

      const replyQueryKeys = queryClient.getQueryCache().findAll({
        queryKey: ["commentReplies", postId],
        exact: false,
      });

      replyQueryKeys.forEach(({ queryKey }) => {
        queryClient.setQueryData(queryKey, (oldReplies) => {
          if (!oldReplies || !oldReplies.pages) return oldReplies;
          return {
            ...oldReplies,
            pages: oldReplies.pages.map((replyPage) => ({
              ...replyPage,
              data: Array.isArray(replyPage.data)
                ? replyPage.data.map((cr) =>
                    cr.username === username ? { ...cr, isFollowed: true } : cr
                  )
                : replyPage.data,
            })),
          };
        });
      });

      return { previousPosts, previousComments, previousFollowingState };
    },
    onError: (error, username, context) => {
      setIsFollowing(context.previousFollowingState);

      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      queryClient.invalidateQueries({ queryKey: ["commentReplies", postId] });

      console.error("Error following user:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["commentReplies", postId] });
    },
    onSettled: () => {},
  });

  const handleReactMutation = useMutation({
    mutationFn: (params) => {
      const { postId, commentId, reaction, previousReaction } = params;
      return previousReaction && previousReaction === reaction
        ? reactToContent(postId, commentId, null, true)
        : reactToContent(postId, commentId, reaction);
    },
  });

  const handleReportMutation = useMutation({
    mutationFn: (params) => {
      const { commentId, reportObj } = params;
      return report(null, commentId, null, null, comment?.isCompany, reportObj);
    },
    onMutate: () => {
      setReportState(1);
    },
    onSuccess: () => {
      setReportState(2);
    },
    onError: (error) => {
      console.error("Error reporting post:", error);
      setReportState(3);
    },
    onSettled: () => {
      setTimeout(() => {
        setReportCommentModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
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
    onSuccess: (newReplyData, variables) => {
      if (nestCount > 2) {
        navigateTo(
          `/u/${postUsername}/post/${postId}/comment/${comment?.commentId}`
        );
        return;
      }
      const oldCommentText = replyText;
      setReplyText("");
      setIsReplying(false);

      const newCommentId = newReplyData.commentId;
      if (!newCommentId) {
        queryClient.invalidateQueries({ queryKey: ["commentReplies", postId] });
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        return;
      }

      const sidebarInfo = queryClient.getQueryData(["sidebarInfo"]) || {};
      const optimisticReply = {
        commentId: newCommentId,
        parentId: comment?.commentId,
        text: oldCommentText.trim(),
        username: sidebarInfo.username || "user",
        profilePicture: sidebarInfo.profilePicture || "",
        fullName: sidebarInfo.name || "User",
        headline: sidebarInfo.headline || "",
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
        isFollowed: false,
        age: determineAge(new Date()),
      };

      queryClient.setQueryData(
        ["commentReplies", postId, comment?.commentId],
        (oldData) => {
          if (!oldData || !oldData.pages || !oldData.pages[0]) {
            return {
              pages: [{ data: [optimisticReply], pageParam: 1 }],
              pageParams: [1],
            };
          }
          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                data: [optimisticReply, ...(oldData.pages[0].data || [])],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      updateAncestorCommentCounts(queryClient, postId, comment?.commentId, 1);

      setShowReplies(true);
    },
    onError: (error) => {
      console.error("Error adding reply:", error);
      setReplyText("");
      setIsReplying(false);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (params) => {
      const { postId, commentId } = params;
      return deleteComment(postId, commentId);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["commentReplies", postId, comment?.commentId],
      });
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({
        queryKey: ["commentReplies", postId, comment?.parentId],
      });

      const previousReplies = queryClient.getQueryData([
        "commentReplies",
        postId,
        comment?.parentId,
      ]);
      const previousComments = queryClient.getQueryData(["comments", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      setIsDeleting(true);

      const commentToDelete = comment;
      const numChildren = commentToDelete?.numComments || 0;
      const delta = -(numChildren + 1);

      if (commentToDelete?.parentId) {
        queryClient.setQueryData(
          ["commentReplies", postId, commentToDelete.parentId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: (page.data || []).filter(
                  (c) => c.commentId !== commentToDelete.commentId
                ),
              })),
            };
          }
        );
      } else {
        queryClient.setQueryData(["comments", postId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: (page.data || []).filter(
                (c) => c.commentId !== commentToDelete.commentId
              ),
            })),
          };
        });
      }

      updateAncestorCommentCounts(
        queryClient,
        postId,
        commentToDelete?.parentId,
        delta
      );

      return {
        previousReplies,
        previousComments,
        previousPost,
        previousPosts,
        commentToDelete,
        delta,
      };
    },
    onSuccess: (data, variables, context) => {
      queryClient.removeQueries({
        queryKey: [
          "commentReplies",
          postId,
          context.commentToDelete?.commentId,
        ],
      });
      if (isSingleComment) {
        router.push("/");
      }
    },
    onError: (err, variables, context) => {
      console.error("Error deleting comment:", err);
      if (context?.previousReplies) {
        queryClient.setQueryData(
          ["commentReplies", postId, context.commentToDelete?.parentId],
          context.previousReplies
        );
      }
      if (!context?.commentToDelete?.parentId && context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: (data, error, variables, context) => {
      setIsDeleting(false);
    },
  });

  const handleLike = (reaction) => {
    const previousReaction = isLiked;

    if (isLiked && isLiked === reaction) {
      setIsLiked(false);
      setReactionCount((prev) => prev - 1);
    } else {
      if (!isLiked) {
        setReactionCount((prev) => prev + 1);
      }
      setIsLiked(reaction);
    }

    handleReactMutation.mutate({
      postId,
      commentId: comment?.commentId,
      reaction: reaction,
      previousReaction,
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

  const handleReport = () => {
    if (!comment?.commentId) {
      setReportState(3);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
      return;
    }

    const reportObj = {
      reason: reportType,
      text: reportType === "Something Else" ? reportText : null,
    };
    handleReportMutation.mutate({ commentId: comment.commentId, reportObj });
  };

  const handleFollow = () => {
    handleFollowMutation.mutate(comment?.username);
  };

  const handleDelete = () => {
    handleDeleteMutation.mutate({
      postId,
      commentId: comment?.commentId,
    });
  };

  const handleShowReplies = () => {
    if (nestCount > 2) {
      navigateTo(
        `/u/${postUsername}/post/${postId}/comment/${comment?.commentId}`
      );
    } else {
      setShowReplies(true);
    }
  };

  const handleHideReplies = () => {
    setShowReplies(false);
  };

  const convertRelation = (relation) => {
    switch (relation) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd+";
      default:
        return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const handleAnimEnd = () => setReactAnim(false);

  const commentAge = determineAge(comment?.time || new Date());
  const hasRepliesSection = showReplies;
  comment.hasReplies = comment?.numComments > 0;

  return (
    <CommentPresentation
      comment={{
        ...comment,
        age: commentAge,
        username: encodeURIComponent(comment?.username),
        relation: convertRelation(comment?.connectionDegree),
        numReacts: reactionCount,
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
      hasReplies={comment?.hasReplies}
      isDeleting={isDeleting}
      nestCount={nestCount}
      postUsername={postUsername}
      isFollowing={isFollowing}
      onKeyPress={handleKeyPress}
      isCommenting={handleCommentMutation.isPending}
      reportText={reportText}
      setReportText={setReportText}
      reportType={reportType}
      setReportType={setReportType}
      reportState={reportState}
      reportCommentModalOpen={reportCommentModalOpen}
      setReportCommentModalOpen={setReportCommentModalOpen}
      deleteCommentModalOpen={deleteCommentModalOpen}
      setDeleteCommentModalOpen={setDeleteModalOpen}
      onReportComment={handleReport}
      reactAnim={reactAnim}
      handleAnimEnd={handleAnimEnd}
    />
  );
}
