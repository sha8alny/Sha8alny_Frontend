import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";
import { Separator } from "@/app/components/ui/Separator";
import { Badge } from "@/app/components/ui/Badge";
import CommentSectionContainer from "../container/CommentSectionContainer";
import {
  PersonAdd,
  Bookmark,
  Repeat,
  ChatBubbleOutline,
  Send,
  OutlinedFlag,
  BookmarkAddOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import ShareContainer from "../container/ShareContainer";
import React from "react";

// TODO: Modify Reactions
// TODO: Add Skeleton
// TODO: Modify Image Section (add dynamic grid based on media length)
// TODO: Add image modal to view all images in a carousel
// TODO: Modify Icons (choose what goes where)

export default function PostPresentation({
  commentSectionOpen,
  setCommentSectionOpen,
  isLiked,
  isSaved,
  onLike,
  onRepost,
  onReport,
  onSave,
  navigateTo,
  post,
  userReactions
}) {
  return (
    <Card className="bg-foreground w-full max-w-2xl mx-auto mb-4">
      {post?.isShared && (
        <div className="flex items-center gap-2 px-4 pt-3 text-sm text-muted">
          <Repeat className="w-4 h-4" />
          <span>{post?.fullName} shared a post</span>
        </div>
      )}

      <CardHeader className="flex flex-row items-start space-y-0 gap-3 pt-3">
        <Avatar
          className="cursor-pointer size-10"
          onClick={() => navigateTo(`/u/${post?.username}`)}
        >
          <AvatarImage src={post?.profilePicture} alt={post?.fullName} />
          <AvatarFallback>
            {post?.fullName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => navigateTo(`/u/${post?.username}`)}
            >
              {post?.fullName}
              {post?.isCompany && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Company
                </Badge>
              )}
            </div>

            <button
              disabled={post?.isFollowed}
              onClick={() => onFollow(post?.username)}
              className={`rounded-2xl items-center flex gap-1 px-2 py-1 text-xs ${
                post?.isFollowed
                  ? "bg-secondary/80 text-background dark:text-primary cursor-default"
                  : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
              } transition-colors duration-200`}
            >
              <PersonAdd sx={{ fontSize: 12 }} />
              {post?.isFollowed ? "Following" : "Follow"}
            </button>
          </div>

          <div className="text-sm text-muted">{post?.headline}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-xs text-muted">{post?.age}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                variant="ghost"
                size="icon"
                className="p-1 rounded-md hover:bg-primary/10 cursor-pointer duration-200"
              >
                <MoreHoriz sx={{ fontSize: "1rem" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSave}>
                {isSaved ? (
                  <>
                    <Bookmark sx={{ fontSize: "1rem" }} className="mr-2" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkAddOutlined
                      sx={{ fontSize: "1rem" }}
                      className="mr-2"
                    />
                    <span>Save</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onReport}>
                <OutlinedFlag sx={{ fontSize: "1rem" }} className="mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="whitespace-pre-line mb-4">{post?.text}</div>

        {post?.media && post?.media.length > 0 && (
          <div
            className={`grid ${
              post?.media.length > 1 ? "grid-cols-2 gap-2" : "grid-cols-1"
            }`}
          >
            {post?.media.map((mediaUrl, index) => (
              <div key={index} className="relative aspect-video">
                <Image
                  src={mediaUrl || "/placeholder.svg?height=300&width=500"}
                  alt={`Post media ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
          onClick={onLike}
        >
          {React.createElement(
            (userReactions[post?.reaction] || userReactions.Like).icon,
            {
              sx: { fontSize: "1rem" },
              className: isLiked
                ? (userReactions[post?.reaction] || userReactions.Like)
                    .className
                : "",
            }
          )}
          <span
            className={`text-muted ${post?.reaction ? "text-secondary" : ""}`}
          >
            {post?.numReacts}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
          onClick={() => setCommentSectionOpen(!commentSectionOpen)}
        >
          <ChatBubbleOutline sx={{ fontSize: "1rem" }} />
          <span
            className={`text-muted ${
              commentSectionOpen ? "text-secondary" : ""
            }`}
          >
            {post?.numComments}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
          onClick={onRepost}
        >
          <Repeat sx={{ fontSize: "1rem" }} />
          <span className="text-muted">{post?.numShares}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
        >
          <Send sx={{ fontSize: "1rem" }} />
        </Button>

        <ShareContainer postId={post?.postId} username={post?.username} />
      </CardFooter>

      {commentSectionOpen && <CommentSectionContainer postId={post?.postId} />}
    </Card>
  );
}

export const PostSkeleton = () => {};
