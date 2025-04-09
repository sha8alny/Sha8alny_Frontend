"use client";
import {
  Bookmark,
  Share,
  MoreHorizontal,
  Search,
  Calendar,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
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
      <div className="p-6 flex justify-center">
        <div className="animate-pulse">Loading saved posts...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Error loading saved posts: {error?.message}
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
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
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search saved posts..."
              className="w-full sm:w-[250px] pl-8 pr-4 h-10 rounded-lg"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {allTaggedPeople.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            <Badge
              variant={selectedPerson === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-opacity-80"
              onClick={() => onPersonSelect(null)}
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
              >
                <User className="h-3 w-3" />
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
    <Card className="overflow-hidden border hover:shadow-md transition-shadow duration-200 bg-hover">
      <div className="flex flex-col sm:flex-row">
      {post.media && post.media.length > 0 && (
          <div className="hidden sm:block w-32 h-auto bg-muted ml-2 rounded-lg overflow-hidden ">
            <img
              src={post.media[0]}
              alt="Post thumbnail"
              className="w-full h-full object-cover"
            />
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
                  {post.connectionDegree === 1 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
                    >
                      {post.randomFirstDegreeConnection || "1st connection"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {post.headline}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
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
                  <User className="h-3 w-3" />
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
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Read post</span>
          </Button>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              <span>{totalReactions}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span>{post.numComments}</span>
            </div>
          </div>
        </CardFooter>
      </div>

      </div>
    </Card>
  );
}

function EmptyState({ searchQuery, selectedPerson, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-hover rounded-lg">
      <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-text">No saved posts found</h3>
      <p className="text-muted-foreground mt-1 max-w-md mx-auto">
        {searchQuery || selectedPerson
          ? "No posts match your current filters"
          : "You haven't saved any posts yet"}
      </p>
      {(searchQuery || selectedPerson) && (
        <Button variant="outline" className="mt-4" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
