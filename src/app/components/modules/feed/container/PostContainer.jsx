"use client";

import { useRouter } from "next/navigation";
import PostPresentation, {
  PostSkeleton,
} from "../presentation/PostPresentation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  determineAge,
  getPost,
  likePost,
  unlikePost,
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
    mutationFn: (postId) => (isLiked ? unlikePost(postId) : likePost(postId)),
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

  const handleLike = () => {
    handleLikeMutation.mutate(post.id);
  };

  const handleRepost = () => {
    handleRepostMutation.mutate(post.id);
  };

  const handleReport = () => {
    handleReportMutation.mutate(post.id);
  };

  const handleSave = () => {
    handleSaveMutation.mutate(post.id);
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
