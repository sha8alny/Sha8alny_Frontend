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
} from "@/app/services/post";
import { useState } from "react";
import { reportPost } from "@/app/services/reportPost";
import { Reactions } from "@/app/utils/Reactions";
import { followUser } from "@/app/services/connectionManagement";

export default function PostContainer({ post }) {
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.reaction || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post?.isFollowed || false);
  const [reactionCount, setReactionCount] = useState(
    post?.numLikes +
      post?.numCelebrates +
      post?.numLoves +
      post?.numSupports +
      post?.numFunnies +
      post?.numInsightfuls
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const fileName = post?.media[0]?.split('/').pop() || "Document";
  const fileExtension = post?.media[0]?.split('.').pop()?.toUpperCase()

  const pathName = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLikeMutation = useMutation({
    mutationFn: (params) => {
      const { postId, reaction } = params;
      if (isLiked && isLiked === reaction) {
        setIsLiked(false);
        setReactionCount((prev) => prev - 1);
      } else {
        if (!isLiked) {
          setReactionCount((prev) => prev + 1);
        }
        setIsLiked(reaction);
      }
      return isLiked && isLiked === reaction
        ? reactToContent(postId, null, null, true)
        : reactToContent(postId, null, reaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleRepostMutation = useMutation({
    mutationFn: (postId) => repostPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleReportMutation = useMutation({
    mutationFn: (postId) => reportPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleSaveMutation = useMutation({
    mutationFn: (postId) => savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setIsSaved(true);
    },
  });

  const handleFollowMutation = useMutation({
    mutationFn: (username) => followUser(username),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      window.location.reload();
    },
  });

  const handleLike = (reaction) => {
    handleLikeMutation.mutate({ postId: post.postId, reaction });
  };

  const handleRepost = () => {
    handleRepostMutation.mutate(post.postId);
  };

  const handleReport = () => {
    handleReportMutation.mutate(post.postId);
  };

  const handleSave = () => {
    handleSaveMutation.mutate(post.postId);
  };

  const handleFollow = (username) => {
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

  // TODO : Modify the share URL for company posts
  const shareUrl = post?.isCompany
    ? `http://sha8alny.uaenorth.cloudapp.azure.com/${pathName}`
    : `http://sha8alny.uaenorth.cloudapp.azure.com/u/${post?.username}/post/${post?.postId}`;

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

  const videoCheck = isVideo(post?.media[0]);
  const documentCheck = isDocument(post?.media[0]);

  return (
    <PostPresentation
      commentSectionOpen={commentSectionOpen}
      setCommentSectionOpen={setCommentSectionOpen}
      isLiked={isLiked}
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
        relation: convertRelation(post?.connectionDegree),
        numReacts: reactionCount,
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
    staleTime: 1000 * 60, // 1 minute
  });
  if (isLoading || isError) return <PostSkeleton />;
  return <PostContainer post={post} />;
};
