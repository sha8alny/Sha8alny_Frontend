import { ExpandMore, PersonAddOutlined, Send } from "@mui/icons-material";
import CommentContainer from "../container/CommentContainer";
import { CommentSkeleton } from "./CommentPresentation";
import { Button } from "@/app/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { Search } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";

/**
 * CommentSectionPresentation - Renders the comments section for posts
 * 
 * This component handles the display of post comments including:
 * - Comment input with user tagging functionality
 * - List of existing comments with proper threading
 * - Loading states during comment fetching
 * - Infinite scrolling for pagination
 * - Navigation to full comment view when appropriate
 * 
 * @param {Object} props - Component props
 * @param {Array} props.comments - Array of comment objects
 * @param {boolean} props.isLoading - Whether comments are initially loading
 * @param {boolean} props.hasMore - Whether more comments are available
 * @param {Function} props.loadMore - Handler for loading more comments
 * @param {Function} props.handleComment - Handler for submitting new comment
 * @param {Function} props.handleKeyPress - Handler for keyboard events
 * @param {string} props.comment - Current comment text input
 * @param {Function} props.setComment - State setter for comment text
 * @param {boolean} props.isSubmittingComment - Whether comment is being submitted
 * @param {string} props.postId - ID of the post being commented on
 * @param {Function} props.navigateTo - Navigation handler for routing
 * @param {boolean} props.isPost - Whether component is on a single post page
 * @param {boolean} props.isLoadingComments - Whether additional comments are loading
 * @param {string} props.postUsername - Username of post author
 * @param {string} props.taggedUser - Current user being tagged
 * @param {Function} props.setTaggedUser - State setter for tagged user
 * @param {Array} props.taggedUsers - Array of tagged users
 * @param {Function} props.handleTagUserClick - Handler for adding tagged user
 * @param {Function} props.handleRemoveTaggedUser - Handler for removing tagged user
 * @param {Function} props.handleUserSearch - Handler for user search
 * @param {boolean} props.isSearching - Whether user search is in progress
 * @param {Array} props.searchResults - Search results for user tagging
 * @param {string|null} props.tagError - Error message for tagging
 * @returns {JSX.Element} Comment section with input and comment list
 */
export default function CommentSectionPresentation({
  comments,
  isLoading,
  hasMore,
  loadMore,
  handleComment,
  handleKeyPress,
  comment,
  setComment,
  isSubmittingComment,
  postId,
  navigateTo,
  isPost,
  isLoadingComments,
  postUsername,
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
    <section
      className="flex flex-col gap-4 w-full"
      data-testid="comment-section-root"
    >
      <div className="w-full" data-testid="comment-section-input-wrapper">
        <div
          className="flex items-center gap-3 w-full p-3 drop-shadow-sm"
          data-testid="comment-section-input-row"
        >
          <div
            className="flex-1 relative"
            data-testid="comment-section-input-container"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full py-2 text-primary px-4 pr-26 bg-foreground rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="comment-section-input"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
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
              <Button
                variant="icon"
                onClick={handleComment}
                disabled={!comment || isSubmittingComment}
                className={`bg-secondary disabled:cursor-default text-background dark:text-primary rounded-md text-sm font-semibold hover:bg-secondary/70 cursor-pointer transition-colors`}
                data-testid="comment-section-send-btn"
              >
                {isSubmittingComment ? (
                  <div
                    className="size-5 animate-spin border-2 border-primary rounded-full border-t-transparent"
                    data-testid="comment-section-send-loading"
                  />
                ) : (
                  <Send sx={{ fontSize: "1rem" }} />
                )}
              </Button>
            </div>
          </div>
        </div>
        {taggedUsers.length > 0 && (
          <div
            className="flex items-center flex-wrap gap-2 px-2"
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
                  onClick={() => handleRemoveTaggedUser(user)}
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
      <div className="pt-4 px-4" data-testid="comment-section-list">
        {comments?.map((comment) => (
          <CommentContainer
            key={comment.commentId}
            comment={comment}
            postId={postId}
            postUsername={postUsername}
            nestCount={0}
            data-testid="comment-section-comment-item"
          />
        ))}
        {isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <CommentSkeleton
              key={index}
              data-testid={`comment-section-loading-${index}`}
            />
          ))}
        {isLoadingComments &&
          Array.from({ length: 2 }).map((_, index) => (
            <CommentSkeleton
              key={index}
              data-testid={`comment-section-loading-comments-${index}`}
            />
          ))}
      </div>
      {hasMore && !isLoadingComments && (
        <button
          className="text-primary font-semibold text-sm flex gap-1 items-center group justify-center cursor-pointer"
          onClick={comments?.length > 5 && !isPost ? navigateTo : loadMore}
          data-testid="comment-section-load-more-btn"
        >
          <ExpandMore sx={{ fontSize: "1rem" }} />
          <span className="group-hover:underline">Load more comments</span>
        </button>
      )}
    </section>
  );
}
