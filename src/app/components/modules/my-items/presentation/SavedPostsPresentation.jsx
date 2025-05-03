"use client";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LaunchIcon from "@mui/icons-material/Launch";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/Card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";

export default function SavedPostsPresentation({
  posts,
  allTaggedPeople,
  searchQuery,
  selectedPerson,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  onSearchChange,
  onPersonSelect,
  onLoadMore,
  onPostClick,
  onClearFilters,
  formatPostTime,
  handleRetry,
}) {
  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64 bg-foreground rounded-xl shadow-lg">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Loading saved Posts...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-foreground rounded-xl text-center mx-auto">
        <ErrorOutlineIcon
          sx={{ fontSize: "3rem" }}
          className=" text-red-500 mx-auto mb-4"
        />
        <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">
          Unable to load saved Posts
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error?.message || "Something went wrong. Please try again."}
        </p>
        <Button
          variant="default"
          onClick={handleRetry}
          className="bg-secondary text-background hover:bg-secondary/80 transition-colors duration-200"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-foreground h-full">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Saved Posts
            </h1>
            <p className="text-muted-foreground text-sm">
              Access your bookmarked articles and resources
            </p>
          </div>
          <div className="relative w-full sm:w-auto text-muted-foreground">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search saved posts..."
              className="w-full sm:w-[250px] pl-8 pr-4 h-10 rounded-lg"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="search-saved-posts-input"
            />
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                onPostClick={onPostClick}
                formatPostTime={formatPostTime}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            selectedPerson={selectedPerson}
            onClearFilters={onClearFilters}
          />
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              variant="outline"
              data-testid="load-more-posts-btn"
            >
              {isFetchingNextPage ? "Loading more..." : "Load more posts"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onPostClick, formatPostTime }) {
  const formattedTime = formatPostTime(post.time);
  const totalReactions = Object.entries({
    likes: post.numLikes || 0,
    celebrates: post.numCelebrates || 0,
    supports: post.numSupports || 0,
    loves: post.numLoves || 0,
    insightfuls: post.numInsightfuls || 0,
    funnies: post.numFunnies || 0,
  }).reduce((sum, [_, count]) => sum + count, 0);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-foreground border border-border/40">
      <div className="flex flex-col sm:flex-row">
        {post.media && post.media.length > 0 && (
          <div className="hidden sm:block w-32 h-auto bg-neutral-700 m-2 rounded-lg overflow-hidden">
            {post.media[0].includes(".mp4") ||
            post.media[0].includes(".webm") ||
            post.media[0].includes(".ogg") ? (
              <video
                onContextMenu={(e) => e.preventDefault()}
                autoPlay={true}
                loop={true}
                muted={true}
                className="w-full h-full object-cover"
                poster={post.media[0]}
              >
                <source src={post.media[0]} />
                Your browser does not support the video tag.
              </video>
            ) : post.media[0].includes(".pdf") ? (
              <div className="w-full h-full flex items-center justify-center bg-background/80">
                <div className="flex flex-col items-center p-2">
                  <PictureAsPdfIcon className="text-red-500" fontSize="large" />
                  <span className="text-xs mt-1 text-center">PDF Document</span>
                </div>
              </div>
            ) : (
              <img
                src={post.media[0]}
                alt="Post thumbnail"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border ring-1 ring-secondary/20">
                  <AvatarImage src={post.profilePicture} alt={post.fullName} />
                  <AvatarFallback className="bg-secondary/20">
                    {post.fullName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{post.fullName}</h3>
                    {post?.connectionDegree > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 bg-green-50/80 text-green-700 border-green-200"
                      >
                        {formatOrdinal(post.connectionDegree)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {post.username || 'user'} · {post.headline}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <CalendarTodayIcon sx={{ fontSize: 12 }} className="mr-1" />
                    <span>{formattedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                <span className="text-xs text-muted-foreground">Tagged:</span>
                {post.tags.map((person) => (
                  <Badge
                    key={person.userId}
                    className="text-xs flex items-center gap-1 bg-secondary"
                  >
                    <PersonIcon sx={{ fontSize: 12 }} />
                    {person.name}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm line-clamp-3 mt-1">{post.text || "No content"}</p>
          </CardContent>
          <CardFooter className="pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 hover:bg-secondary/10"
              onClick={() => onPostClick(post.postId, post.username)}
              data-testid={`read-post-btn-${post.postId}`}
            >
              <LaunchIcon sx={{ fontSize: 14 }} />
              <span>Read post</span>
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center">
                <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} className="mr-1" />
                <span>{totalReactions}</span>
              </div>
              <div className="flex items-center">
                <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} className="mr-1" />
                <span>{post.numComments}</span>
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );

function formatOrdinal(number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = number % 100;
  return (
    number +
    (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
  );
}
}

function EmptyState({ searchQuery, selectedPerson, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-hover rounded-lg">
      <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-text">No saved posts found</h3>
      <p className="text-muted-foreground mt-1 max-w-md mx-auto">
        {searchQuery || selectedPerson
          ? "No posts match your current filters"
          : "You haven't saved any posts yet"}
      </p>
      {(searchQuery || selectedPerson) && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={onClearFilters}
          data-testid="clear-filters-btn"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
