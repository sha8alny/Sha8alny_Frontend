"use client";

import { usePathname, useRouter } from "next/navigation";
import PostPresentation, {
  PostSkeleton,
} from "../presentation/PostPresentation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  determineAge,
  getPost,
  savePost,
  deletePost,
  reactToContent,
  repostPost,
  editPost,
} from "@/app/services/post";
import { useState } from "react";
import { Reactions } from "@/app/utils/Reactions";
import { followUser } from "@/app/services/connectionManagement";
import { report } from "@/app/services/privacy";
import { useEffect } from "react";
import { useRef } from "react";
import { messagingService } from "@/app/services/messagingService";
import { useToast } from "@/app/context/ToastContext";

export default function PostContainer({ post, singlePost = false }) {
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const [reactions, setReactions] = useState({
    current: post?.reaction || false,
    counts: {
      Like: post?.numLikes || 0,
      Celebrate: post?.numCelebrates || 0,
      Love: post?.numLoves || 0,
      Support: post?.numSupports || 0,
      Funny: post?.numFunnies || 0,
      Insightful: post?.numInsightfuls || 0,
    },
    total:
      post?.numLikes +
        post?.numCelebrates +
        post?.numLoves +
        post?.numSupports +
        post?.numFunnies +
        post?.numInsightfuls || 0,
  });
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post?.isFollowed || false);
  const [numReposts, setNumReposts] = useState(post?.numShares || 0);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reportState, setReportState] = useState(0); // 0: initial, 1: loading, 2: success, 3: error
  const [imagesOpen, setImagesOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [reactAnim, setReactAnim] = useState(false);

  // Edit post states
  const [postText, setPostText] = useState(post?.text || "");

  const toast = useToast();
  const prevReaction = useRef(reactions.current);

  useEffect(() => {
    console.log("post?.isFollowed", post?.isFollowed);
    if (post?.isFollowed !== isFollowing) {
      setIsFollowing(post?.isFollowed);
    }
  }, [post?.isFollowed]);

  const fileName = post?.media[0]?.split("/").pop() || "Document";
  const fileExtension = post?.media[0]?.split(".").pop()?.toUpperCase();
  const reportOptions = [
    "Spam",
    "Harassment",
    "Hate Speech",
    "Nudity",
    "Violence",
    "Suicide or Self-Injury",
    "False News",
    "Unauthorized Sales",
    "Terrorism",
    "Something Else",
  ];

  const pathName = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleEditMutation = useMutation({
    mutationFn: (data) => editPost(post.postId, data),
    onSuccess: () => {
      // Close edit modal
      setEditModalOpen(false);

      // Update the post in the cache for all relevant queries
      if (post?.isCompany) {
        queryClient.setQueryData(["posts", post?.username], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              Array.isArray(page)
                ? page.map((p) =>
                    p.postId === post.postId ? { ...p, text: postText } : p
                  )
                : page
            ),
          };
        });
      }

      // Update in main posts list
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.map((p) =>
                  p.postId === post.postId ? { ...p, text: postText } : p
                )
              : page
          ),
        };
      });

      if (singlePost) {
        queryClient.setQueryData(["post", post.postId], (oldData) => {
          return { ...oldData, text: postText };
        });
      }
      toast("Post updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast("Failed to update post. Please try again.", false);
    },
  });

  const handleEdit = () => {
    const formData = new FormData();
    formData.append("text", postText);
    handleEditMutation.mutate(formData);
  };
  const handleLikeMutation = useMutation({
    mutationFn: (params) => {
      const { postId, reaction, previousReaction } = params;
      return previousReaction && previousReaction === reaction
        ? reactToContent(postId, null, null, true)
        : reactToContent(postId, null, reaction);
    },
    onSuccess: (data, variables) => {
      // Force refresh of UI state after successful reaction change
      const { reaction, previousReaction } = variables;

      // No need to update if we're just removing a reaction (already handled in handleLike)
      if (previousReaction === reaction) return;

      // If we're changing reactions, make sure the UI fully updates
      if (previousReaction && previousReaction !== reaction) {
        // Force a state update to ensure the UI refreshes
        setReactions({ ...reactions });
      }
    },
  });

  const handleRepostMutation = useMutation({
    mutationFn: (postId) => repostPost(postId),
    onError: () => {
      setNumReposts((prev) => prev - 1);
    },
  });

  const handleReportMutation = useMutation({
    mutationFn: (params) => {
      const { postId, reportObj } = params;
      console.log("Reporting post with reason:", reportObj);

      return report(postId, null, null, null, null, reportObj);
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
        setReportModalOpen(false);
        setReportText("");
        setReportType(null);
        setReportState(0);
      }, 2000);
    },
  });

  const handleSaveMutation = useMutation({
    mutationFn: (postId) => savePost(postId),
    onMutate: () => {
      const previousSavedState = isSaved;
      setIsSaved(true);
      return { previousSavedState };
    },
    onError: (error, variables, context) => {
      setIsSaved(context.previousSavedState);
    },
  });

  const handleFollowMutation = useMutation({
    mutationFn: (username) => followUser(username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      await queryClient.cancelQueries({ queryKey: ["commentReplies"] });

      const previousPosts = queryClient.getQueryData(["posts"]);
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

      const commentQueryKeys = queryClient.getQueryCache().findAll({
        queryKey: ["comments"],
        exact: false,
      });

      commentQueryKeys.forEach(({ queryKey }) => {
        queryClient.setQueryData(queryKey, (oldComments) => {
          if (!oldComments || !oldComments.pages) return oldComments;
          return {
            ...oldComments,
            pages: oldComments.pages.map((commentPage) => ({
              ...commentPage,
              data: Array.isArray(commentPage.data)
                ? commentPage.data.map((c) =>
                    c.username === username ? { ...c, isFollowed: true } : c
                  )
                : commentPage.data,
            })),
          };
        });
      });

      const replyQueryKeys = queryClient.getQueryCache().findAll({
        queryKey: ["commentReplies"],
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

      return { previousPosts, previousFollowingState };
    },
    onError: (err, username, context) => {
      setIsFollowing(context.previousFollowingState);

      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }

      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["commentReplies"] });

      console.error("Error following user:", err);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      if (post?.isCompany) {
        queryClient.setQueryData(["posts", post?.username], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              Array.isArray(page)
                ? page.filter((otherPost) => otherPost.postId !== post.postId)
                : page
            ),
          };
        });
      }
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.filter((otherPost) => otherPost.postId !== post.postId)
              : page
          ),
        };
      });
      if (singlePost) {
        router.push("/");
      }
    },
  });

  const handleLike = (reaction) => {
    const previousReaction = reactions.current;

    setReactions((prev) => {
      // Create a copy of the current state
      const newState = {
        ...prev,
        counts: { ...prev.counts },
      };

      // Case 1: Removing a reaction (unliking)
      if (previousReaction === reaction) {
        newState.counts[previousReaction] = Math.max(
          0,
          newState.counts[previousReaction] - 1
        );
        newState.current = false;
        newState.total = Math.max(0, newState.total - 1);
      }
      // Case 2: Changing from one reaction to another
      else if (previousReaction && previousReaction !== reaction) {
        // Decrement previous reaction count
        newState.counts[previousReaction] = Math.max(
          0,
          newState.counts[previousReaction] - 1
        );

        // Increment new reaction count
        newState.counts[reaction] = newState.counts[reaction] + 1;

        newState.current = reaction;
        // Total count stays the same when switching reactions
      }
      // Case 3: Adding a new reaction (no previous reaction)
      else {
        // Increment new reaction count
        newState.counts[reaction] = newState.counts[reaction] + 1;

        newState.current = reaction;
        newState.total = newState.total + 1;
      }

      return newState;
    });

    handleLikeMutation.mutate({
      postId: post.postId,
      reaction,
      previousReaction,
    });
  };

  const handleRepost = () => {
    setNumReposts((prev) => prev + 1);
    handleRepostMutation.mutate(post.postId);
  };

  const handleReport = () => {
    if (!post?.postId) {
      console.error("Cannot report: postId is missing or invalid.", post);
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
    handleReportMutation.mutate({ postId: post.postId, reportObj });
  };

  const handleSave = () => {
    handleSaveMutation.mutate(post.postId);
  };

  const handleFollow = (username) => {
    setIsFollowing(true);
    handleFollowMutation.mutate(username);
  };

  const handleDelete = () => {
    handleDeleteMutation.mutate(post.postId);
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

  const getLayout = (count) => {
    switch (count) {
      case 1:
        return {
          layoutClass: "grid grid-cols-1",
          itemClasses: ["aspect-video"],
        };
      case 2:
        return {
          layoutClass: "grid grid-cols-2",
          itemClasses: ["aspect-video", "aspect-video"],
        };
      case 3:
        return {
          layoutClass: "grid grid-rows-2 grid-cols-3",
          itemClasses: [
            "aspect-video row-span-2 col-span-2 w-full h-full",
            "aspect-video",
            "aspect-video",
          ],
        };
      case 4:
        return {
          layoutClass: "grid grid-rows-3 grid-cols-3",
          itemClasses: [
            "aspect-video w-full h-full row-span-3 col-span-2",
            "aspect-video",
            "aspect-video",
            "aspect-video",
          ],
        };
      default:
        const itemClasses = [
          "aspect-video w-full h-full row-span-3 col-span-2",
        ];
        for (let i = 1; i < count; i++) {
          itemClasses.push("aspect-video");
        }
        return {
          layoutClass: "grid grid-rows-3 grid-cols-3",
          itemClasses: itemClasses,
        };
    }
  };

  const shareUrl = post?.isCompany
    ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/company/${post?.username}/post/${post?.postId}`
    : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/u/${post?.username}/post/${post?.postId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(shareUrl);

  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    const extension = mediaUrl.split(".").pop().toLowerCase();
    const videoExtensions = ["mp4", "webm", "mov", "avi", "wmv", "mkv"];
    return videoExtensions.includes(extension);
  };

  const isDocument = (mediaUrl) => {
    if (!mediaUrl) return false;
    const extension = mediaUrl.split(".").pop().toLowerCase();
    const documentExtensions = [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "xls",
      "xlsx",
    ];
    return documentExtensions.includes(extension);
  };

  const extractLinks = (text) => {
    if (!text) return { element: null };

    const urlRegex =
      /(https?:\/\/[^\s]+)|(\b(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?)/g;

    let lastIndex = 0;
    const elements = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }

      const url = match[0];
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;

      elements.push(
        <a
          key={match.index}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:underline break-all"
        >
          {url}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return {
      element: elements.length > 0 ? elements : text,
      hasLinks: elements.length > 1,
    };
  };

  const videoCheck = isVideo(post?.media[0]) || post?.mediaType === "video";
  const documentCheck =
    isDocument(post?.media[0]) || post?.mediaType === "document";

  // Updated carousel functions with proper loading state management
  const openImageCarousel = (index) => {
    setCarouselIndex(index);
    setImagesOpen(true);
    setImageLoading(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageCarousel = () => {
    setImagesOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    setImageLoading(true);
    setCarouselIndex((prev) =>
      prev === post?.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setImageLoading(true);
    setCarouselIndex((prev) =>
      prev === 0 ? post?.media.length - 1 : prev - 1
    );
  };

  const handleImageLoad = () => {
    setTimeout(() => {
      setImageLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (reactions.current && prevReaction.current !== reactions.current) {
      setReactAnim(true);
      prevReaction.current = reactions.current;
    }
  }, [reactions.current]);

  const handleAnimEnd = () => setReactAnim(false);

  const getActiveReactions = () => {
    const reactionsList = [
      {
        name: "Like",
        count: reactions.counts.Like,
        borderColor: "border-secondary",
      },
      {
        name: "Celebrate",
        count: reactions.counts.Celebrate,
        borderColor: "border-green-500",
      },
      {
        name: "Love",
        count: reactions.counts.Love,
        borderColor: "border-red-500",
      },
      {
        name: "Support",
        count: reactions.counts.Support,
        borderColor: "border-purple-400",
      },
      {
        name: "Funny",
        count: reactions.counts.Funny,
        borderColor: "border-blue-300",
      },
      {
        name: "Insightful",
        count: reactions.counts.Insightful,
        borderColor: "border-yellow-300",
      },
    ];

    const activeReactions = reactionsList.filter(
      (reaction) => reaction.count > 0
    );
    const sortedReactions = [...activeReactions].sort(
      (a, b) => b.count - a.count
    );
    const topReactionIcons = sortedReactions.slice(0, 3).map((reaction) => ({
      ...reaction,
      icon: Reactions[reaction.name].icon,
    }));

    return {
      allActive: activeReactions,
      topReactions: topReactionIcons,
    };
  };

  return (
    <PostPresentation
      commentSectionOpen={commentSectionOpen}
      setCommentSectionOpen={setCommentSectionOpen}
      isLiked={reactions.current}
      isSaved={isSaved}
      onLike={handleLike}
      onRepost={handleRepost}
      onReport={handleReport}
      onSave={handleSave}
      onDelete={handleDelete}
      onFollow={handleFollow}
      navigateTo={navigateTo}
      post={{
        ...post,
        age: determineAge(post?.time),
        textElement: extractLinks(post?.text).element,
        relation: convertRelation(post?.connectionDegree),
        numReacts: reactions.total,
        numShares: numReposts,
      }}
      userReactions={Reactions}
      layoutClass={getLayout(post?.media.length).layoutClass}
      itemClasses={getLayout(post?.media.length).itemClasses}
      isVideo={videoCheck}
      shareModalOpen={shareModalOpen}
      setShareModalOpen={setShareModalOpen}
      reportModalOpen={reportModalOpen}
      setReportModalOpen={setReportModalOpen}
      deleteModalOpen={deleteModalOpen}
      setDeleteModalOpen={setDeleteModalOpen}
      copied={copied}
      copyToClipboard={copyToClipboard}
      shareUrl={encodedUrl}
      isDocument={documentCheck}
      isFollowing={isFollowing}
      setIsLoading={setIsLoading}
      setHasError={setHasError}
      hasError={hasError}
      isLoading={isLoading}
      fileName={fileName}
      fileExtension={fileExtension}
      isDeleting={handleDeleteMutation.isPending}
      errorDeleting={handleDeleteMutation.isError}
      errorDeleteMessage={
        handleDeleteMutation.error?.message || "Error deleting post"
      }
      reportOptions={reportOptions}
      reportText={reportText}
      setReportText={setReportText}
      reportType={reportType}
      setReportType={setReportType}
      reportState={reportState}
      isSinglePost={singlePost}
      imagesOpen={imagesOpen}
      carouselIndex={carouselIndex}
      openImageCarousel={openImageCarousel}
      closeImageCarousel={closeImageCarousel}
      nextImage={nextImage}
      prevImage={prevImage}
      imageLoading={imageLoading}
      handleImageLoad={handleImageLoad}
      setCarouselIndex={setCarouselIndex}
      setImageLoading={setImageLoading}
      reactAnim={reactAnim}
      handleAnimEnd={handleAnimEnd}
      allReactions={getActiveReactions()}
      editModalOpen={editModalOpen}
      setEditModalOpen={setEditModalOpen}
      onEdit={handleEdit}
      postText={postText}
      setPostText={setPostText}
      numReacts={reactions.total}
      isEditing={handleEditMutation.isPending}
      errorEditing={handleEditMutation.isError}
    />
  );
}

export const PostContent = ({ postId }) => {
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    staleTime: Infinity,
  });
  if (isLoading || isError) return <PostSkeleton />;
  return <PostContainer post={post} singlePost={true} />;
};
