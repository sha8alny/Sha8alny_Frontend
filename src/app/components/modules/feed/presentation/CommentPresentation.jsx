"use client";

import {
  Favorite,
  FavoriteBorder,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";
import CommentContainer from "../container/CommentContainer";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommentPresentation({
  comment,
  isLiked,
  onLike,
  postId,
  onReply,
  navigateTo,
  showAllReplies,
  repliesPerPage = 3,
  hasMoreReplies,
  displayedReplies,
  toggleReplies,
  replyText,
  setReplyText,
  isReplying,
  setIsReplying,
}) {

  return (
    <div className="w-full flex flex-col mb-4 text-primary">
      <div className="flex gap-3">
        <div className="size-10 relative flex-shrink-0">
          <Image
            src={
              true
                ? "https://picsum.photos/200/200"
                : comment?.user?.profilePicture
            }
            alt="User"
            fill
            className="rounded-full border"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateTo(comment?.user?.username)}
                  className="text-sm font-medium hover:underline cursor-pointer"
                >
                  {comment?.user?.name}
                </button>
                <span className="text-xs text-muted"> • </span>
                <span className="text-xs text-muted">
                  {comment?.user?.relation}
                </span>
              </div>
              <span className="text-xs text-muted">
                {comment.age}
              </span>
            </div>
            <p className="text-sm">{comment?.text}</p>
          </div>

          <div className="flex items-center gap-4 pl-1">
            <button
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                isLiked
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={onLike}
            >
              {isLiked ? (
                <Favorite className="h-4 w-4" />
              ) : (
                <FavoriteBorder className="h-4 w-4" />
              )}
              <span>{comment?.likes}</span>
            </button>
            <button
              className="text-xs text-muted hover:text-red-500 duration-200 cursor-pointer transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="flex items-end gap-2 mt-2">
              <Textarea
                placeholder="Write a reply..."
                className="min-h-[80px] flex-1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                size="icon"
                onClick={onReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {comment?.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-2 border-l border-primary/20 pl-4 space-y-4">
          {displayedReplies.map((reply) => (
            <CommentContainer key={reply._id} postId={postId} comment={reply} />
          ))}

          {hasMoreReplies && (
            <button
              onClick={toggleReplies}
              className="flex items-center mt-2 text-primary text-xs font-medium hover:underline"
            >
              {showAllReplies ? (
                <>
                  <ExpandLess fontSize="small" className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ExpandMore fontSize="small" className="mr-1" />
                  Show {comment.replies.length - repliesPerPage} more{" "}
                  {comment.replies.length - repliesPerPage === 1
                    ? "reply"
                    : "replies"}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
