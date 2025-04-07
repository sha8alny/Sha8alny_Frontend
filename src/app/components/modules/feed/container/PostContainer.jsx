"use client";

import { useRouter } from "next/navigation";
import PostPresentation, {
  PostSkeleton,
} from "../presentation/PostPresentation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  determineAge,
  getPost,
  likePostComment as likePost,
  unlikePostComment as unlikePost,
  savePost,
} from "@/app/services/post";
import { useState } from "react";
import { repostPost } from "@/app/services/repostPost";
import { reportPost } from "@/app/services/reportPost";
import { Reactions } from "@/app/utils/Reactions";

export default function PostContainer({ post }) {
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.reaction || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLikeMutation = useMutation({
    mutationFn: (params) => {
      const { postId, reaction } = params;
      return isLiked && post?.reaction === reaction
        ? unlikePost(postId)
        : likePost(postId, reaction);
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
      navigateTo={navigateTo}
      post={{ ...post, age: determineAge(post?.time) }}
      userReactions={Reactions}
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
