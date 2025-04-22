"use client";

import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const queryClient = useQueryClient();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLikeMutation = useMutation({
    mutationFn: (params) => {
      const { postId, reaction } = params;
      (isLiked && post?.reaction === reaction) ? setIsLiked(false) : setIsLiked(reaction); // Optimistic update
      return isLiked && post?.reaction === reaction
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
      setIsSaved((prev) => !prev);
    },
  });

  const handleFollowMutation = useMutation({
    mutationFn: (username) => followUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
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
  
  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    const extension = mediaUrl.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
    return videoExtensions.includes(extension);
  };

  const videoCheck = isVideo(post?.media[0]);

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
        numReacts:
          post?.numLikes +
          post?.numCelebrates +
          post?.numLoves +
          post?.numSupports +
          post?.numFunnies +
          post?.numInsightfuls,
      }}
      userReactions={Reactions}
      layoutClass={getLayout(post?.media.length).layoutClass}
      itemClasses={getLayout(post?.media.length).itemClasses}
      isVideo={videoCheck}
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
