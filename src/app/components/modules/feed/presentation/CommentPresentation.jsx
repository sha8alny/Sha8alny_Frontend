import {
  ExpandLess,
  ExpandMore,
  Person,
  PersonAdd,
  PersonAddOutlined,
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
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { Search } from "lucide-react";

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
  taggedUser,
  setTaggedUser,
  taggedUsers,
  handleTagUserClick,
  handleRemoveTaggedUser,
  handleUserSearch,
  isSearching,
  searchResults,
  tagError,
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
            <div className="flex gap-2 flex-wrap items-center">
              <p className="text-sm" data-testid="comment-text">
                {comment?.text}
              </p>
              {comment?.tags?.length > 0 &&
                comment?.tags.map((user) => (
                  <Link
                    key={user.userId}
                    href={`/u/${user.username}`}
                    className="text-sm text-secondary/70 font-semibold hover:underline cursor-pointer"
                    data-testid={`comment-tag-${user.userId}`}
                  >
                    @{user.name}
                  </Link>
                ))}
            </div>
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

            {!showReplies && comment.hasReplies && (
              <button
                className="text-xs text-muted hover:underline duration-200 cursor-pointer transition-colors"
                onClick={onShowReplies}
                data-testid="comment-show-replies-btn"
              >
                <ExpandMore fontSize="small" className="mr-1" />
                Show replies ({comment.numComments})
              </button>
            )}

            {showReplies && comment.hasReplies && (
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
              className="flex flex-col gap-2 mt-2"
              data-testid="comment-reply-section"
            >
              <div className="flex items-end gap-2">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="icon"
                      className="bg-gradient-to-br from-secondary/60 to-blue-500 text-background dark:text-primary rounded-md text-sm font-semibold hover:bg-secondary/70 cursor-pointer transition-colors"
                      data-testid="comment-section-more-btn"
                    >
                      <PersonAddOutlined sx={{ fontSize: "1rem" }} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-3 pointer-events-auto"
                    align="end"
                    data-testid="tag-user-popover-content"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">
                        Tag people in your post
                      </h4>
                      <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                        <Search className="h-4 w-4 text-muted" />
                        <input
                          type="text"
                          value={taggedUser}
                          onChange={(e) => {
                            setTaggedUser(e.target.value);
                            handleUserSearch(e.target.value);
                          }}
                          className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                          placeholder="Search for people..."
                          data-testid="tag-user-search"
                        />
                      </div>
                      {/* Skeleton loading state */}
                      {taggedUser && taggedUser.length > 1 && isSearching && (
                        <div
                          className="mt-2 max-h-60 overflow-y-auto space-y-2"
                          data-testid="user-search-skeleton"
                        >
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 rounded-md animate-pulse"
                            >
                              <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                              <div className="flex flex-col space-y-1.5 flex-1">
                                <div className="h-3 bg-primary/30 rounded w-24"></div>
                                <div className="h-2 bg-primary/20 rounded w-40"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Search results */}
                      {searchResults.length > 0 && (
                        <div className="mt-2 max-h-60 overflow-y-auto">
                          {searchResults.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                              onClick={() => handleTagUserClick(user)}
                              data-testid={`user-search-result-${user._id}`}
                            >
                              <Avatar className="h-8 w-8 ring-1 ring-secondary/10">
                                <AvatarImage
                                  src={user.profilePicture}
                                  alt={user.name}
                                />
                                <AvatarFallback className="text-xs bg-secondary/5">
                                  {user.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                  {user.name}
                                </span>
                                {user.headline && (
                                  <span className="text-xs text-muted truncate max-w-[180px]">
                                    {user.headline}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* No results state - only show when there was an attempt to search */}
                      {taggedUser &&
                        taggedUser.length > 2 &&
                        searchResults.length === 0 && (
                          <div className="mt-2 p-3 text-center rounded-md">
                            <p className="text-xs text-primary font-semibold mb-1">
                              No users found.
                            </p>
                            <p className="text-[11px] text-muted">
                              Try a different search term.
                            </p>
                          </div>
                        )}
                      {/* Error state */}
                      {tagError && (
                        <div className="mt-2 p-3 text-center">
                          <p className="text-xs text-red-500 mb-1">
                            {tagError}
                          </p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {taggedUsers.length > 0 && (
                <div
                  className="flex items-center flex-wrap gap-2 px-2 mt-1"
                  data-testid="tagged-users-container"
                >
                  {taggedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 bg-secondary text-background rounded-full px-2 font-semibold py-1 text-xs"
                      data-testid={`tagged-user-${user._id}`}
                    >
                      <span>{user.name}</span>
                      <button
                        onClick={() => handleRemoveTaggedUser(user._id)}
                        className="text-background cursor-pointer hover:bg-primary/10 rounded-full px-1"
                        data-testid={`remove-tagged-user-${user._id}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
