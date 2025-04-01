"use client";
import {
  reactToContent,
  getCommentReplies,
  addComment,
} from "@/app/services/post";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CommentPresentation from "../presentation/CommentPresentation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Celebration,
  CelebrationOutlined,
  EmojiEmotions,
  EmojiEmotionsOutlined,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbUpOutlined,
  TipsAndUpdates,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import { followUser } from "@/app/services/connectionManagement";

const Reactions = {
  Like: {
    unlikedIcon: ThumbUpOutlined,
    likedIcon: ThumbUp,
    likedClassName: "text-secondary",
    label: "Like",
  },
  Celebrate: {
    unlikedIcon: CelebrationOutlined,
    likedIcon: Celebration,
    likedClassName: "text-secondary",
    label: "Celebrate",
  },
  Support: {
    unlikedIcon: FavoriteBorder,
    likedIcon: Favorite,
    likedClassName: "text-secondary",
    label: "Support",
  },
  Love: {
    unlikedIcon: FavoriteBorder,
    likedIcon: Favorite,
    likedClassName: "text-red-500 dark:text-red-400",
    label: "Love",
  },
  Funny: {
    unlikedIcon: EmojiEmotionsOutlined,
    likedIcon: EmojiEmotions,
    likedClassName: "text-secondary",
    label: "Funny",
  },
  Insightful: {
    unlikedIcon: TipsAndUpdatesOutlined,
    likedIcon: TipsAndUpdates,
    likedClassName: "text-yellow-500 dark:text-yellow-400",
    label: "Insightful",
  },
};

export default function CommentContainer({ postId, comment }) {
  const [isLiked, setIsLiked] = useState(comment?.reaction !== null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Use infinite query for proper pagination
  const {
    data,
    isLoading: isLoadingReplies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["commentReplies", postId, comment?.commentId],
    queryFn: ({ pageParam = 1 }) =>
      getCommentReplies(postId, comment?.commentId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0)
        return undefined;
      return allPages.length + 1;
    },
    enabled: !!comment?.commentId && !comment.isReply, // Only fetch if we have a commentId and it's not a reply itself
  });

  // Flatten the pages array for display
  const displayedReplies = data?.pages.flat() || [];

  const loadMoreReplies = () => {
    fetchNextPage();
  };

  const navigateTo = (username) => {
    router.push(`/u/${username}`);
  };

  const determineCommentAge = (createdAt) => {
    const currentTime = new Date();
    const commentTime = new Date(createdAt);
    const timeDifference = currentTime - commentTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years}y`;
    } else if (months > 0) {
      return `${months}m`;
    } else if (weeks > 0) {
      return `${weeks}w`;
    } else if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleFollowMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const handleReactMutation = useMutation({
    mutationFn: reactToContent,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      console.error("Error reacting to comment:", error);
    },
  });

  const handleCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
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

  const handleLike = () => {
    handleReactMutation.mutate({
      postId,
      commentId: comment?.commentId,
      reaction: "Like", // TODO : Add dynamic reaction selection
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;

    handleCommentMutation.mutate({
      postId,
      commentId: comment?.commentId,
      text: replyText,
      tags: [],
    });
  };

  const handleFollow = (username) => {
    handleFollowMutation.mutate(username);
  };

  const commentAge = determineCommentAge(comment?.time || new Date());
  const hasRepliesSection =
    !comment.isReply && (displayedReplies?.length > 0 || isLoadingReplies);

  return (
    <CommentPresentation
      comment={{
        ...comment,
        age: commentAge,
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
    />
  );
}
