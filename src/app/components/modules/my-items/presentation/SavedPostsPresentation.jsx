"use client";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/Dropdown-menu";
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
}) {
  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64 bg-foreground rounded-xl shadow-lg">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Loading saved jobs...
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
          Unable to load saved jobs
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

        {allTaggedPeople.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            <Badge
              variant={selectedPerson === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-opacity-80"
              onClick={() => onPersonSelect(null)}
              data-testid="filter-all-badge"
            >
              All
            </Badge>
            {allTaggedPeople.map((person) => (
              <Badge
                key={person.userId}
                variant={
                  selectedPerson === person.userId ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-opacity-80 flex items-center gap-1"
                onClick={() =>
                  onPersonSelect(
                    selectedPerson === person.userId ? null : person.userId
                  )
                }
                data-testid={`filter-person-badge-${person.userId}`}
              >
                <PersonIcon className="h-3 w-3" />
                {person.fullName}
              </Badge>
            ))}
          </div>
        )}

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
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-foreground ">
      <div className="flex flex-col sm:flex-row">
        {post.media && post.media.length > 0 && (
          <div className="hidden sm:block w-32 h-auto bg-neutral-700 ml-2 rounded-lg overflow-hidden ">
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
              <div className="w-full h-full flex items-center justify-center bg-background">
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
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={post.profilePicture} alt={post.fullName} />
                  <AvatarFallback>
                    {post.fullName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{post.fullName}</h3>
                    {post?.connectionDegree > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
                      >
                        {formatOrdinal(post.connectionDegree)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {post.headline}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <CalendarTodayIcon fontSize="0.75rem" className=" mr-1" />
                    <span>{formattedTime}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizIcon fontSize="1rem" className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ShareIcon className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    <span>Remove from saved</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Report content</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            {post.taggedPeople && post.taggedPeople.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                <span className="text-xs text-muted-foreground">Tagged:</span>
                {post.taggedPeople.map((person) => (
                  <Badge
                    key={person.userId}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    <PersonIcon className="h-3 w-3" />
                    {person.fullName}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm line-clamp-3">{post.text || "No content"}</p>
          </CardContent>
          <CardFooter className="pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => onPostClick(post.postId, post.username)}
              data-testid={`read-post-btn-${post.postId}`}
            >
              <LaunchIcon fontSize="0.875rem" className="h-3.5 w-3.5" />
              <span>Read post</span>
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center">
                <ThumbUpOutlinedIcon className="h-3 w-3 mr-1" />
                <span>{totalReactions}</span>
              </div>
              <div className="flex items-center">
                <ChatBubbleOutlineIcon className="h-3 w-3 mr-1" />
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
