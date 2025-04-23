import {
  ExpandLess,
  ExpandMore,
  Person,
  PersonAdd,
  Send,
  ThumbUpOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import Image from "next/image";
import CommentContainer from "../container/CommentContainer";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import React from "react";
import Celebrate from "@/app/components/ui/Celebrate";
import Support from "@/app/components/ui/Support";
import Insightful from "@/app/components/ui/Insightful";
import Like from "@/app/components/ui/Like";
import Love from "@/app/components/ui/Love";
import Funny from "@/app/components/ui/Funny";

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
  showMoreButtonText = "Show more replies",
  showReplies,
  onShowReplies,
  onHideReplies,
  hasReplies,
  onDelete,
  isDeleting,
  nestCount,
  postUsername,
  isFollowing
}) {
  return (
    <div className="w-full flex flex-col mb-4 text-primary">
      <div className="flex gap-3">
        <Avatar
          className="cursor-pointer size-10"
          onClick={() =>
            comment?.isCompany
              ? navigateTo(`company-user-admin/${comment?.username}/about-page`)
              : navigateTo(`/u/${comment?.username}`)
          }
        >
          <AvatarImage src={comment?.profilePicture} alt={comment?.fullName} />
          <AvatarFallback>
            {comment?.fullName?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      comment?.connectionDegree === -1
                        ? navigateTo(
                            `company-user-admin/${comment?.username}/about-page`
                          )
                        : navigateTo(`u/${comment?.username}`)
                    }
                    className="text-sm font-semibold hover:underline cursor-pointer"
                  >
                    {comment?.fullName}
                  </button>
                  {comment?.relation && (
                    <div className="text-muted text-xs space-x-1 flex items-center">
                      <span className="text-muted text-xs">•</span>
                      <span className="text-muted text-xs mr-1">
                        {comment?.relation}
                      </span>
                    </div>
                  )}
                  {comment?.connectionDegree !== 0 &&
                    comment?.connectionDegree !== -1 && (
                      <button
                        disabled={isFollowing}
                        onClick={() => onFollow(comment?.username)}
                        className={`rounded-2xl items-center flex px-2 py-1 text-xs group ${
                          isFollowing
                            ? "bg-secondary/80 text-background dark:text-primary cursor-default"
                            : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        } transition-colors duration-200`}
                      >
                        {isFollowing ? (
                          <Person sx={{ fontSize: "0.75rem" }} />
                        ) : (
                          <PersonAdd sx={{ fontSize: "0.75rem" }} />
                        )}
                        <span className="max-w-0 overflow-hidden group-hover:max-w-24 group-hover:ml-2 group-hover:mr-1 transition-all duration-300 whitespace-nowrap">
                          {isFollowing ? "Following" : "Follow"}
                        </span>
                      </button>
                    )}
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
            <span
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? "text-primary" : "text-muted hover:text-foreground"
              }`}
              onClick={onLike}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span
                      onClick={() => onLike("Like")}
                      className="flex p-1 items-center text-sm gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
                    >
                      {comment?.reaction === "Like" && <Like size="1.3rem" />}
                      {comment?.reaction === "Insightful" && (
                        <Insightful size="1.3rem" />
                      )}
                      {comment?.reaction === "Support" && (
                        <Support size="1.3rem" />
                      )}
                      {comment?.reaction === "Funny" && <Funny size="1.3rem" />}
                      {comment?.reaction === "Love" && <Love size="1.3rem" />}
                      {comment?.reaction === "Celebrate" && (
                        <Celebrate size="1.3rem" />
                      )}
                      {!!comment?.reaction || (
                        <ThumbUpOutlined
                          sx={{ fontSize: "1rem" }}
                          className="rotate-y-180"
                        />
                      )}
                      <span
                        className={`text-muted ${
                          comment?.reaction ? "text-secondary" : ""
                        }`}
                      >
                        {comment?.numReacts}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-foreground flex gap-1 border text-primary rounded-md">
                    {Object.entries(userReactions).map(([name, { icon }]) => (
                      <div
                        key={name}
                        onClick={() => {
                          onLike(name);
                        }}
                        className="relative group flex items-center justify-center flex-1 px-2"
                      >
                        <div className="cursor-pointer duration-300 transition-transform">
                          {React.createElement(icon, {
                            className:
                              "transform transition-transform group-hover:scale-150 duration-200",
                          })}
                        </div>

                        <div className="absolute bottom-[125%] mb-1 px-2 py-1 rounded bg-primary text-background text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {name}
                        </div>
                      </div>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <button
              className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
            {comment?.connectionDegree === 0 && (
              <button
                className={`text-xs ${
                  isDeleting
                    ? "text-muted cursor-default"
                    : "text-muted hover:underline cursor-pointer"
                }`}
                disabled={isDeleting}
                onClick={onDelete}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <div className="size-3 animate-spin border-2 border-t-transparent border-secondary rounded-full mr-1" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            )}

            {!showReplies && hasReplies && (
              <button
                className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
                onClick={onShowReplies}
              >
                <ExpandMore fontSize="small" className="mr-1" />
                Show replies ({comment.numComments})
              </button>
            )}

            {showReplies && hasReplies && (
              <button
                className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
                onClick={onHideReplies}
              >
                <span className="flex items-center">
                  <ExpandLess fontSize="small" className="mr-1" />
                  Hide replies
                </span>
              </button>
            )}
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
                <Send sx={{ fontSize: "1rem" }} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasRepliesSection && (
        <div className="ml-10 mt-2 border-l border-primary/20 pl-4 space-y-4">
          {isLoadingReplies && !isFetchingMoreReplies ? (
            <div className="flex flex-col justify-center p-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <CommentSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {displayedReplies.map((reply) => (
                <CommentContainer
                  key={reply.commentId}
                  postId={postId}
                  comment={{ ...reply, isReply: true }}
                  nestCount={nestCount + 1}
                  postUsername={postUsername}
                />
              ))}

              {hasMoreReplies && (
                <button
                  onClick={loadMoreReplies}
                  className="flex items-center mt-2 text-primary text-xs font-medium hover:underline"
                  disabled={isFetchingMoreReplies}
                >
                  {isFetchingMoreReplies ? (
                    <div className="size-4 animate-spin border-2 border-t-transparent border-secondary rounded-full mr-2" />
                  ) : (
                    <ExpandMore fontSize="small" className="mr-1" />
                  )}
                  {isFetchingMoreReplies
                    ? "Loading more replies..."
                    : showMoreButtonText}
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
