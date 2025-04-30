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
import Dialog from "@/app/components/ui/DialogMod";
import GeneralDeletePresentation from "@/app/components/layout/GeneralDelete";
import ReportPresentation from "./ReportPresentation";

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
  isFollowing,
  onKeyPress,
  isCommenting,
  reportText,
  setReportText,
  reportType,
  setReportType,
  reportState,
  reportCommentModalOpen,
  setReportCommentModalOpen,
  deleteCommentModalOpen,
  setDeleteCommentModalOpen,
  onReportComment,
  reactAnim,
  handleAnimEnd,
}) {
  return (
    <div
      className="w-full flex flex-col mb-4 text-primary"
      data-testid="comment-root"
    >
      <div className="flex gap-3">
        <Avatar
          className="cursor-pointer size-10"
          onClick={() =>
            comment?.isCompany
              ? navigateTo(`company-user-admin/${comment?.username}/about-page`)
              : navigateTo(`/u/${comment?.username}`)
          }
          data-testid="comment-avatar"
        >
          <AvatarImage
            src={comment?.profilePicture}
            alt={comment?.fullName}
            data-testid="comment-avatar-img"
          />
          <AvatarFallback data-testid="comment-avatar-fallback">
            {comment?.fullName?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1" data-testid="comment-body">
          <div
            className="bg-primary/10 rounded-lg p-3"
            data-testid="comment-content"
          >
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
                    data-testid="comment-username-btn"
                  >
                    {comment?.fullName}
                  </button>
                  {comment?.relation && (
                    <div
                      className="text-muted text-xs space-x-1 flex items-center"
                      data-testid="comment-relation"
                    >
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
                        data-testid="comment-follow-btn"
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
                <span
                  className="text-xs text-muted"
                  data-testid="comment-headline"
                >
                  {comment?.headline}
                </span>
              </div>
              <span
                className="text-xs self-start text-muted"
                data-testid="comment-age"
              >
                {comment.age}
              </span>
            </div>
            <p className="text-sm" data-testid="comment-text">
              {comment?.text}
            </p>
          </div>

          <div
            className="flex items-center gap-4 pl-1"
            data-testid="comment-actions"
          >
            <span
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? "text-primary" : "text-muted hover:text-foreground"
              }`}
              data-testid="comment-like-span"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span
                      onClick={() => onLike("Like")}
                      className="flex p-1 items-center text-sm gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
                      data-testid="comment-like-btn"
                    >
                      <span
                        className={`inline-flex items-center ${
                          reactAnim ? "animate-react-pop" : ""
                        }`}
                        onAnimationEnd={handleAnimEnd}
                        data-testid="comment-like-anim"
                      >
                        {isLiked === "Like" && (
                          <Like size="1.5rem" data-testid="comment-like-icon" />
                        )}
                        {isLiked === "Insightful" && (
                          <Insightful
                            size="1.3rem"
                            data-testid="comment-insightful-icon"
                          />
                        )}
                        {isLiked === "Support" && (
                          <Support
                            size="1.5rem"
                            data-testid="comment-support-icon"
                          />
                        )}
                        {isLiked === "Funny" && (
                          <Funny
                            size="1.5rem"
                            data-testid="comment-funny-icon"
                          />
                        )}
                        {isLiked === "Love" && (
                          <Love size="1.5rem" data-testid="comment-love-icon" />
                        )}
                        {isLiked === "Celebrate" && (
                          <Celebrate
                            size="1.5rem"
                            data-testid="comment-celebrate-icon"
                          />
                        )}
                        {!isLiked && (
                          <ThumbUpOutlined
                            sx={{ fontSize: "1.3rem" }}
                            className="rotate-y-180"
                            data-testid="comment-thumbup-icon"
                          />
                        )}
                      </span>
                      <span
                        className={
                          isLiked
                            ? "text-secondary/70 font-semibold"
                            : "text-muted"
                        }
                        data-testid="comment-num-reacts"
                      >
                        {comment?.numReacts}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-foreground flex gap-1 border text-primary rounded-md"
                    data-testid="comment-reactions-tooltip"
                  >
                    {Object.entries(userReactions).map(([name, { icon }]) => (
                      <div
                        key={name}
                        onClick={() => {
                          onLike(name);
                        }}
                        className="relative group flex items-center justify-center flex-1 px-2"
                        data-testid={`comment-reaction-${name.toLowerCase()}`}
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
              data-testid="comment-reply-btn"
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
                onClick={() => setDeleteCommentModalOpen(true)}
                data-testid="comment-delete-btn"
              >
                {isDeleting ? (
                  <span
                    className="flex items-center"
                    data-testid="comment-delete-loading"
                  >
                    <div className="size-3 animate-spin border-2 border-t-transparent border-secondary rounded-full mr-1" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            )}
            {comment?.connectionDegree !== 0 && (
              <button
                className={`text-xs ${
                  reportCommentModalOpen
                    ? "text-muted cursor-default"
                    : "text-muted hover:underline cursor-pointer"
                }`}
                disabled={reportCommentModalOpen}
                onClick={() => setReportCommentModalOpen(true)}
                data-testid="comment-report-btn"
              >
                Report
              </button>
            )}

            {!showReplies && hasReplies && (
              <button
                className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
                onClick={onShowReplies}
                data-testid="comment-show-replies-btn"
              >
                <ExpandMore fontSize="small" className="mr-1" />
                Show replies ({comment.numComments})
              </button>
            )}

            {showReplies && hasReplies && (
              <button
                className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
                onClick={onHideReplies}
                data-testid="comment-hide-replies-btn"
              >
                <span className="flex items-center">
                  <ExpandLess fontSize="small" className="mr-1" />
                  Hide replies
                </span>
              </button>
            )}
          </div>

          {isReplying && (
            <div
              className="flex items-end gap-2 mt-2"
              data-testid="comment-reply-section"
            >
              <Textarea
                placeholder="Write a reply..."
                className="flex-1 text-sm"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={onKeyPress}
                rows={1}
                data-testid="comment-reply-textarea"
              />
              <Button
                size="icon"
                onClick={onReply}
                disabled={!replyText.trim() || isCommenting}
                className="cursor-pointer bg-secondary/80 dark:text-primary hover:bg-secondary/60 transition-colors duration-200"
                data-testid="comment-reply-send-btn"
              >
                {isCommenting ? (
                  <div
                    className="size-4 animate-spin border-2 border-t-transparent rounded-full border-primary"
                    data-testid="comment-reply-loading"
                  />
                ) : (
                  <Send sx={{ fontSize: "1rem" }} />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasRepliesSection && (
        <div
          className="ml-10 mt-2 border-l border-primary/20 pl-4 space-y-4"
          data-testid="comment-replies-section"
        >
          {isLoadingReplies && !isFetchingMoreReplies ? (
            <div
              className="flex flex-col justify-center p-4"
              data-testid="comment-replies-loading"
            >
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
                  comment={{
                    ...reply,
                    isReply: true,
                    parentId: comment.commentId,
                  }}
                  nestCount={nestCount + 1}
                  postUsername={postUsername}
                  data-testid="comment-reply-item"
                />
              ))}

              {hasMoreReplies && (
                <button
                  onClick={loadMoreReplies}
                  className="flex items-center mt-2 text-primary text-xs font-medium hover:underline"
                  disabled={isFetchingMoreReplies}
                  data-testid="comment-load-more-replies-btn"
                >
                  {isFetchingMoreReplies ? (
                    <div
                      className="size-4 animate-spin border-2 border-t-transparent border-secondary rounded-full mr-2"
                      data-testid="comment-load-more-replies-loading"
                    />
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
      {/* Delete Modal */}
      <Dialog
        open={deleteCommentModalOpen}
        onOpenChange={setDeleteCommentModalOpen}
        buttonClass="hidden"
        AlertContent={
          <GeneralDeletePresentation
            onConfirmDelete={onDelete}
            isLoading={isDeleting}
            onOpenChange={setDeleteCommentModalOpen}
            itemType="Comment"
            errorTitle="Error"
            errorMessage="Failed to delete comment."
            confirmTitle="Delete"
            confirmMessage="This action cannot be undone. Are you sure you want to delete this comment?"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
          />
        }
        testId="comment-delete-modal"
      />

      {/* Report Modal */}
      <Dialog
        open={reportCommentModalOpen}
        onOpenChange={setReportCommentModalOpen}
        buttonClass="hidden"
        AlertContent={
          <ReportPresentation
            type="comment"
            reportText={reportText}
            setReportText={setReportText}
            reportType={reportType}
            setReportType={setReportType}
            reportState={reportState}
            onReport={onReportComment}
          />
        }
        testId="comment-report-modal"
      />
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
