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
  Person,
  Delete,
} from "@mui/icons-material";
import ShareContainer from "../container/ShareContainer";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";

// TODO: Add image modal to view all images in a carousel
// TODO: Modify Icons (choose what goes where)
// TODO: Add toast for like, comment, repost, and save actions

export default function PostPresentation({
  commentSectionOpen,
  setCommentSectionOpen,
  isLiked,
  isSaved,
  onLike,
  onFollow,
  onRepost,
  onReport,
  onSave,
  onDelete,
  navigateTo,
  post,
  userReactions,
  layoutClass,
  itemClasses,
}) {
  return (
    <Card className="bg-foreground w-full max-w-2xl mx-auto mb-4">
      {post?.isShared && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2 px-4 text-sm text-muted">
            <Avatar className="size-6 cursor-pointer">
              <AvatarImage
                src={post?.isShared?.profilePicture}
                alt={post?.isShared?.fullName}
                onClick={() => navigateTo(`/u/${post?.isShared?.username}`)}
              />
              <AvatarFallback>
                {post?.isShared?.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>
              <span
                className="hover:underline cursor-pointer"
                onClick={() => navigateTo(`/u/${post?.isShared?.username}`)}
              >
                {post?.isShared?.fullName}
              </span>{" "}
              shared a post
            </span>
          </div>
          <Separator />
        </div>
      )}

      <CardHeader
        className={`flex flex-row items-start space-y-0 gap-3 ${
          post?.isShared ? "" : "pt-3"
        }`}
      >
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
              className="font-semibold flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() => navigateTo(`/u/${post?.username}`)}
            >
              {post?.fullName}
              {post?.isCompany && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Company
                </Badge>
              )}
            </div>
            {post?.relation && (
              <div className="text-muted text-xs space-x-2 flex items-center">
                <span className="text-muted text-xs">•</span>
                <span className="text-muted text-xs">{post?.relation}</span>
              </div>
            )}
            {(post?.connectionDegree !== 0 &&
              post?.connectionDegree !== -1) && (
              <button
                disabled={post?.isFollowed}
                onClick={() => onFollow(post?.username)}
                className={`rounded-2xl items-center flex px-2 py-1 text-xs group ${
                  post?.isFollowed
                    ? "bg-secondary/80 text-background dark:text-primary cursor-default"
                    : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                } transition-colors duration-200`}
              >
                {post?.isFollowed &&
                (post?.connectionDegree !== 0 ||
                  post?.connectionDegree !== -1) ? (
                  <Person sx={{ fontSize: "0.75rem" }} />
                ) : (
                  <PersonAdd sx={{ fontSize: "0.75rem" }} />
                )}
                <span className="max-w-0 overflow-hidden group-hover:max-w-24 group-hover:ml-2 group-hover:mr-1 transition-all duration-300 whitespace-nowrap">
                  {post?.isFollowed ? "Following" : "Follow"}
                </span>
              </button>
            )}
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
                <MoreHoriz sx={{ fontSize: "1.3rem" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSave}>
                {isSaved ? (
                  <>
                    <Bookmark sx={{ fontSize: "1.3rem" }} />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkAddOutlined sx={{ fontSize: "1.3rem" }} />
                    <span>Save</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={post?.connectionDegree !== 0 ? onReport : onDelete}
              >
                {post?.connectionDegree !== 0 && (
                  <>
                    <OutlinedFlag sx={{ fontSize: "1.3rem" }} />
                    <span>Report</span>
                  </>
                )}
                {post?.connectionDegree === 0 && (
                  <>
                    <Delete sx={{ fontSize: "1.3rem" }} />
                    <span>Delete</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="whitespace-pre-line mb-4">{post?.text}</div>

        {post?.media && post?.media.length > 0 && (
          <div className={`gap-2 ${layoutClass}`}>
            {post?.media
              .slice(0, post?.media.length > 4 ? 4 : post?.media.length)
              .map((mediaUrl, index) => (
                <div
                  key={index}
                  className={`relative ${itemClasses[index]}`}
                  onClick={() => post?.onMediaClick?.(index)}
                >
                  <Image
                    src={mediaUrl || ""}
                    alt={`Post media ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  {index === 3 && post?.media.length > 4 && (
                    <div className="absolute inset-0 bg-background/40 flex items-center justify-center rounded-md">
                      <span className="text-primary text-2xl font-bold">
                        +{post?.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span
                onClick={() => onLike("Like")}
                className="flex p-1 items-center text-sm gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
              >
                {React.createElement(
                  (userReactions[post?.reaction] || userReactions.Like).icon,
                  {
                    sx: { fontSize: "1.3rem" },
                    className: isLiked
                      ? (userReactions[post?.reaction] || userReactions.Like)
                          .className
                      : "",
                  }
                )}
                <span
                  className={`text-muted ${
                    post?.reaction ? "text-secondary" : ""
                  }`}
                >
                  {post?.numReacts}
                </span>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground border text-primary rounded-md">
              <div className="flex gap-3 w-full">
                {Object.entries(userReactions).map(
                  ([name, { icon, className }]) => (
                    <div
                      key={name}
                      onClick={() => {
                        onLike(name);
                      }}
                      className="relative group flex items-center justify-center flex-1 px-2"
                    >
                      <div className="cursor-pointer group-hover:scale-140 duration-300 transition-transform">
                        {React.createElement(icon, {
                          sx: { fontSize: "2rem" },
                          className: className,
                        })}
                      </div>

                      <div className="absolute bottom-[125%] mb-1 px-2 py-1 rounded bg-primary text-background text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {name}
                      </div>
                    </div>
                  )
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
          onClick={() => setCommentSectionOpen(!commentSectionOpen)}
        >
          <ChatBubbleOutline sx={{ fontSize: "1.3rem" }} />
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
          <Repeat sx={{ fontSize: "1.3rem" }} />
          <span className="text-muted">{post?.numShares}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 items-center cursor-pointer text-primary rounded-md hover:bg-primary/10"
        >
          <Send sx={{ fontSize: "1.3rem" }} />
        </Button>

        <ShareContainer
          postId={post?.postId}
          username={post?.username}
          fontSize="1.3rem"
        />
      </CardFooter>

      {commentSectionOpen && <CommentSectionContainer postId={post?.postId} />}
    </Card>
  );
}

export const PostSkeleton = () => {
  return (
    <Card className="w-full bg-foreground max-w-2xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-start space-y-0 gap-3 pt-3">
        <div className="w-10 h-10 rounded-full bg-primary/30 animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-1/3 bg-primary/30 animate-pulse rounded mb-2" />
          <div className="h-4 w-1/2 bg-primary/30 animate-pulse rounded mb-1" />
          <div className="h-3 w-1/4 bg-primary/30 animate-pulse rounded-md" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-20 bg-primary/30 animate-pulse rounded-md mb-4" />
        <div className="h-64 bg-primary/30 animate-pulse rounded-md" />
      </CardContent>
    </Card>
  );
};
