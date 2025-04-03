import { ExpandMore, PersonAdd, Send } from "@mui/icons-material";

import Image from "next/image";
import CommentContainer from "../container/CommentContainer";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import React from "react";

export default function CommentPresentation({
  comment,
  isLiked,
  onLike,
  postId,
  onReply,
  navigateTo,
  displayedReplies,
  hasMoreReplies,
  isLoadingReplies,
  isFetchingMoreReplies,
  loadMoreReplies,
  replyText,
  setReplyText,
  isReplying,
  setIsReplying,
  onFollow,
  hasRepliesSection,
  userReactions,
}) {
  return (
    <div className="w-full flex flex-col mb-4 text-primary">
      <div className="flex gap-3">
        <div className="size-10 relative flex-shrink-0">
          <Image
            src={comment?.profilePicture || "https://picsum.photos/200/200"}
            alt={comment?.fullName || "User"}
            fill
            className="rounded-full border"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateTo(comment?.username)}
                    className="text-sm font-medium hover:underline cursor-pointer"
                  >
                    {comment?.fullName}
                  </button>
                  <button
                    disabled={comment?.isFollowed}
                    onClick={() => onFollow(comment?.username)}
                    className={`rounded-2xl items-center flex gap-1 ml-2 px-2 py-1 text-xs ${
                      comment.isFollowed
                        ? "bg-secondary/80 text-background dark:text-primary cursor-default"
                        : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                    } transition-colors duration-200`}
                  >
                    <PersonAdd sx={{ fontSize: 12 }} />
                    {comment?.isFollowed ? "Following" : "Follow"}
                  </button>
                </div>
                <span className="text-xs text-muted">{comment?.headline}</span>
              </div>
              <span className="text-xs self-start text-muted">
                {comment.age}
              </span>
            </div>
            <p className="text-sm">{comment?.text}</p>
          </div>

          <div className="flex items-center gap-4 pl-1">
            <button
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? "text-primary" : "text-muted hover:text-foreground"
              }`}
              onClick={onLike}
            >
              {React.createElement(
                (userReactions[comment?.reaction] || userReactions.Like).icon,
                {
                  sx: { fontSize: "1rem" },
                  className: isLiked
                    ? (userReactions[comment?.reaction] || userReactions.Like)
                        .className
                    : "",
                }
              )}
              <span className="text-muted">{comment?.numReacts}</span>
            </button>
            <button
              className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="flex items-end gap-2 mt-2">
              <Textarea
                placeholder="Write a reply..."
                className="min-h-[80px] flex-1 text-sm"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                size="icon"
                onClick={onReply}
                disabled={!replyText.trim()}
                className="cursor-pointer bg-secondary/80 dark:text-primary hover:bg-secondary/60 transition-colors duration-200"
              >
                <Send sx={{ fontSize: 17 }} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasRepliesSection && (
        <div className="ml-10 mt-2 border-l border-primary/20 pl-4 space-y-4">
          {isLoadingReplies && !isFetchingMoreReplies ? (
            <div className="flex justify-center p-4">
              <div className="size-6 animate-spin border-2 border-t-transparent border-secondary rounded-full mr-2" />
            </div>
          ) : (
            <>
              {displayedReplies.map((reply) => (
                <CommentContainer
                  key={reply.commentId}
                  postId={postId}
                  comment={{ ...reply, isReply: true }}
                />
              ))}

              {hasMoreReplies && (
                <button
                  onClick={loadMoreReplies}
                  className="flex items-center mt-2 text-primary text-xs font-medium hover:underline"
                  disabled={isFetchingMoreReplies}
                >
                  {isFetchingMoreReplies ? (
                    <div className="size-6 border-2 border-t-transparent animate-spin border-secondary rounded-full mr-2" />
                  ) : (
                    <ExpandMore fontSize="small" className="mr-1" />
                  )}
                  {isFetchingMoreReplies
                    ? "Loading more replies..."
                    : "Show more replies"}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export const CommentSkeleton = () => {
  return (
    <div className="w-full flex gap-3 mb-4 animate-pulse">
      <div className="size-10 relative flex-shrink-0">
        <div className="rounded-full h-full border bg-primary/20" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="bg-primary/10 rounded-lg p-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <div className="rounded-full bg-primary/20 h-4 w-24" />
                <span className="text-xs text-muted"> • </span>
                <span className="text-xs text-muted rounded-full bg-primary/20 h-4 w-16" />
              </div>
              <span className="text-xs text-muted rounded-full bg-primary/20 h-3 w-36" />
            </div>
            <span className="text-xs self-start text-muted rounded-full bg-primary/20 h-3 w-6" />
          </div>
          <p className="text-sm rounded-full bg-primary/20 h-4 w-full" />
        </div>
      </div>
    </div>
  );
};
