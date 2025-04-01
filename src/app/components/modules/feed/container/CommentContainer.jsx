"use client";
import { likeComment } from "@/app/services/post";
import { useMutation } from "@tanstack/react-query";
import CommentPresentation from "../presentation/CommentPresentation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentContainer({ postId, comment }) {
  const [isLiked, setIsLiked] = useState(comment?.isLiked || false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const repliesPerPage = 3;
  const router = useRouter();

  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  //   const handleReply = () => {
  //     if (!replyText.trim()) return;
  //     onReply(replyText);
  //     setReplyText("");
  //     setIsReplying(false);
  //   };

  const hasMoreReplies =
    comment?.replies && comment.replies.length > repliesPerPage;

  const displayedReplies = comment?.replies
    ? showAllReplies
      ? comment.replies
      : comment.replies.slice(0, repliesPerPage)
    : [];

  const toggleReplies = () => {
    setShowAllReplies(!showAllReplies);
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

  const handleLikeMutate = useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      setIsLiked((prev) => !prev);
    },
    onError: (error) => {
      // TODO: Handle error appropriately
      console.error("Error liking comment:", error);
    },
  });

  const replyToComment = false; // Placeholder for the reply function

  // TODO: Reply should refresh the comment replies
  const handleReplyMutate = useMutation({
    mutationFn: replyToComment,
    onSuccess: () => {
      // TODO: add refresh logic here
    },
    onError: () => {
      // TODO: Handle error appropriately
    },
  });

  const handleLike = () => {
    handleLikeMutate.mutate(postId, comment?._id);
  };

  const handleReply = (reply) => {
    handleReplyMutate.mutate(postId, comment?._id, reply);
  };

  comment.createdAt = new Date(2025, 2, 28).toISOString(); // Placeholder for the comment creation date
  comment.age = determineCommentAge(comment?.createdAt);

  return (
    <CommentPresentation
      comment={comment}
      isLiked={isLiked}
      onLike={handleLike}
      onReply={handleReply}
      navigateTo={navigateTo}
      postId={postId}
      showAllReplies={showAllReplies}
      toggleReplies={toggleReplies}
      hasMoreReplies={hasMoreReplies}
      displayedReplies={displayedReplies}
      repliesPerPage={repliesPerPage}
      isReplying={isReplying}
      setIsReplying={setIsReplying}
      replyText={replyText}
      setReplyText={setReplyText}
      handleReply={handleReply}
    />
  );
}
