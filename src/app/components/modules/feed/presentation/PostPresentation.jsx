import Image from "next/image";
import SafeImage from "@/app/components/ui/SafeImage";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import SafeVideo from "@/app/components/ui/SafeVideo";
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
import CommentSectionContainer from "../container/CommentSectionContainer";
import {
  PersonAdd,
  Bookmark,
  Repeat,
  ChatBubbleOutline,
  OutlinedFlag,
  BookmarkAddOutlined,
  MoreHoriz,
  Person,
  Delete,
  ThumbUpOutlined,
  Share,
  Verified,
  IosShare,
  Send,
  CommentOutlined,
} from "@mui/icons-material";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import Like from "@/app/components/ui/Like";
import Insightful from "@/app/components/ui/Insightful";
import Celebrate from "@/app/components/ui/Celebrate";
import Love from "@/app/components/ui/Love";
import Funny from "@/app/components/ui/Funny";
import Support from "@/app/components/ui/Support";
import Dialog from "@/app/components/ui/DialogMod";
import SharePresentation from "../presentation/SharePresentation";
import { usePathname } from "next/navigation";
import ReportPresentation from "./ReportPresentation";
import GeneralDeletePresentation from "@/app/components/layout/GeneralDelete";

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
  isVideo,
  shareModalOpen,
  setShareModalOpen,
  reportModalOpen,
  setReportModalOpen,
  deleteModalOpen,
  setDeleteModalOpen,
  copied,
  copyToClipboard,
  shareUrl,
  isDocument,
  isFollowing,
  setIsLoading,
  setHasError,
  hasError,
  isLoading,
  fileName,
  fileExtension,
  isDeleting,
  errorDeleting,
  errorDeleteMessage,
  reportOptions,
  reportState,
  reportText,
  setReportText,
  reportType,
  setReportType,
  isSinglePost,
  imagesOpen,
  carouselIndex,
  openImageCarousel,
  closeImageCarousel,
  nextImage,
  prevImage,
  imageLoading,
  handleImageLoad,
  setCarouselIndex,
  setImageLoading,
  reactAnim,
  handleAnimEnd,
}) {
  return (
    <>
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
                  {post?.isShared?.fullName?.substring(0, 2).toUpperCase()}
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
            onClick={() =>
              post?.isCompany
                ? navigateTo(`company-user-admin/${post?.username}/about-page`)
                : navigateTo(`/u/${post?.username}`)
            }
          >
            <AvatarImage src={post?.profilePicture} alt={post?.fullName} />
            <AvatarFallback>
              {post?.fullName?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div
                className="font-semibold flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() =>
                  post?.isCompany
                    ? navigateTo(
                        `company-user-admin/${post?.username}/about-page`
                      )
                    : navigateTo(`/u/${post?.username}`)
                }
              >
                {post?.fullName}
                {post?.isCompany && (
                  <Verified
                    className="text-secondary"
                    sx={{ fontSize: "1rem" }}
                  />
                )}
              </div>
              {post?.relation && (
                <div className="text-muted text-xs space-x-2 flex items-center">
                  <span className="text-muted text-xs">•</span>
                  <span className="text-muted text-xs">{post?.relation}</span>
                </div>
              )}
              {post?.connectionDegree !== 0 &&
                post?.connectionDegree !== -1 && (
                  <button
                    disabled={isFollowing}
                    onClick={() => onFollow(post?.username)}
                    className={`rounded-2xl items-center flex px-2 py-1 text-xs group ${
                      isFollowing
                        ? "bg-secondary/80 text-background dark:text-primary cursor-default"
                        : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                    } transition-colors duration-200`}
                  >
                    {isFollowing &&
                    (post?.connectionDegree !== 0 ||
                      post?.connectionDegree !== -1) ? (
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
                <DropdownMenuItem onClick={() => setShareModalOpen(true)}>
                  <IosShare sx={{ fontSize: "1.3rem" }} />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={
                    post?.connectionDegree !== 0
                      ? () => setReportModalOpen(true)
                      : () => setDeleteModalOpen(true)
                  }
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
          <div className="whitespace-pre-line">
            <p className="mb-3">{post?.textElement}</p>
          </div>
          {isDocument && post?.media && post?.media.length > 0 && (
            <div className="relative w-full rounded-lg overflow-hidden border border-primary/10 bg-primary/5">
              {/* Document header with info */}
              <div className="flex items-center justify-between p-2 bg-primary/10">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium truncate">
                    {fileExtension + " Document" || "Document"}
                  </span>
                </div>
                <a
                  href={post?.media[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <span>Open</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Document preview with React state for loading/error */}
              <div className="relative aspect-[4/3] w-full bg-background">
                {!hasError && (
                  <embed
                    src={post?.media[0]}
                    type="application/pdf"
                    className="absolute inset-0 w-full h-full"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false);
                      setHasError(true);
                    }}
                  />
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 transition-opacity duration-300">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Error fallback */}
                {hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-primary/70 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-primary/70">
                      Document preview unavailable
                    </p>
                    <a
                      href={post?.media[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 px-3 py-1.5 bg-primary text-background rounded-md text-sm hover:bg-primary/80 transition-colors"
                    >
                      Open Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          {!isDocument && isVideo && post?.media && post?.media.length > 0 && (
            <SafeVideo
              src={post?.media[0]}
              controls
              className="w-full aspect-video rounded-2xl"
            />
          )}
          {!isDocument && !isVideo && post?.media && post?.media.length > 0 && (
            <div className={`gap-2 ${layoutClass}`}>
              {post?.media
                .slice(0, post?.media.length > 4 ? 4 : post?.media.length)
                .map((mediaUrl, index) => (
                  <div
                    key={index}
                    className={`relative ${itemClasses[index]} cursor-pointer group`}
                    onClick={() => openImageCarousel(index)}
                  >
                    <SafeImage
                      src={mediaUrl}
                      alt={`Post media ${index + 1}`}
                      fill
                      className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                    {index === 3 && post?.media.length > 4 && (
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center group-hover:scale-105 transition-all duration-300 rounded-md">
                        <span className="text-primary text-2xl font-bold">
                          +{post?.media.length - 4}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 ease-in-out transition-all duration-300 rounded-md pointer-events-none">
                      <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M15 3h6v6"></path>
                          <path d="M10 14L21 3"></path>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {post?.keywords?.length > 0 && (
            <span className="text-background text-xs flex gap-1.5 flex-wrap pt-3">
              {post?.keywords.map((keyword, index) => (
                <span
                  className="px-2 py-1 font-semibold bg-secondary/20 text-secondary rounded-full"
                  key={index}
                >
                  {index > 0 && " "}
                  <span
                    onClick={() =>
                      navigateTo(`search/results?keyword=${keyword}&type=post`)
                    }
                    className="hover:underline cursor-pointer"
                  >
                    #{keyword}
                  </span>
                </span>
              ))}
            </span>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span
                  onClick={() => onLike("Like")}
                  className="flex p-1 items-center text-sm gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
                >
                  <span
                    className={`inline-flex items-center ${
                      reactAnim ? "animate-react-pop" : ""
                    }`}
                    onAnimationEnd={handleAnimEnd}
                  >
                    {isLiked === "Like" && <Like size="1.5rem" />}
                    {isLiked === "Insightful" && <Insightful size="1.3rem" />}
                    {isLiked === "Support" && <Support size="1.5rem" />}
                    {isLiked === "Funny" && <Funny size="1.5rem" />}
                    {isLiked === "Love" && <Love size="1.5rem" />}
                    {isLiked === "Celebrate" && <Celebrate size="1.5rem" />}
                    {!isLiked && (
                      <ThumbUpOutlined
                        sx={{ fontSize: "1.3rem" }}
                        className="rotate-y-180"
                      />
                    )}
                  </span>
                  <span
                    className={
                      isLiked ? "text-secondary/70 font-semibold" : "text-muted"
                    }
                  >
                    {post?.numReacts}
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

          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 cursor-pointer text-primary rounded-md hover:bg-primary/10"
            onClick={() => setCommentSectionOpen(!commentSectionOpen)}
          >
            <CommentOutlined sx={{ fontSize: "1.3rem" }} />
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
            <Send sx={{ fontSize: "1.3rem" }} className="-rotate-45" />
          </Button>
        </CardFooter>

        {commentSectionOpen && (
          <CommentSectionContainer
            username={post?.username}
            postId={post?.postId}
          />
        )}

        <Dialog
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          buttonClass="hidden"
          className="min-w-max"
          AlertContent={
            <SharePresentation
              copyToClipboard={copyToClipboard}
              copied={copied}
              shareUrl={shareUrl}
            />
          }
        />
        <Dialog
          open={reportModalOpen}
          onOpenChange={setReportModalOpen}
          buttonClass="hidden"
          className="min-w-max"
          AlertContent={
            <ReportPresentation
              type="post"
              reportOptions={reportOptions}
              reportState={reportState}
              reportText={reportText}
              setReportText={setReportText}
              reportType={reportType}
              setReportType={setReportType}
              onReport={onReport}
            />
          }
        />
        <Dialog
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          buttonClass="hidden"
          className="min-w-max"
          AlertContent={
            <GeneralDeletePresentation
              onConfirmDelete={onDelete}
              isLoading={isDeleting}
              isError={errorDeleting}
              error={errorDeleteMessage}
              onOpenChange={setDeleteModalOpen}
              itemType="Post"
              loadingText="Deleting post..."
              errorTitle="Error"
              errorMessage="Failed to delete post"
              confirmTitle="Delete"
              confirmMessage="This action cannot be undone. Are you sure you want to delete this post?"
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
            />
          }
        />
      </Card>

      {/* Improved Image Carousel Modal */}
      {imagesOpen && post?.media && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeImageCarousel}
          data-testid="image-carousel-modal"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-background bg-secondary rounded-full p-2.5 hover:bg-secondary/80 cursor-pointer transition-colors duration-200 shadow-lg z-50"
            onClick={closeImageCarousel}
            aria-label="Close image carousel"
          >
            <X size={24} />
          </button>

          {/* Navigation buttons - only show if multiple images */}
          {post.media.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-background bg-secondary rounded-full p-2.5 hover:bg-secondary/80 cursor-pointer transition-colors duration-200 shadow-lg z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-background bg-secondary rounded-full p-2.5 hover:bg-secondary/80 cursor-pointer transition-colors duration-200 shadow-lg z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative max-w-[95vw] max-h-[95vh] min-h-[300px] min-w-[300px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Better loading indicator with smoother transitions */}
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-in fade-in duration-200">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-white animate-spin" />
                  <div className="absolute inset-0 blur-lg opacity-50">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-white/80 mt-4 text-sm">Loading image...</p>
              </div>
            )}

            {/* Image with improved transitions */}
            <img
              src={post?.media[carouselIndex]}
              alt={`Image ${carouselIndex + 1}`}
              className={`max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl transition-opacity duration-500 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
              key={`carousel-${post?.postId}-${carouselIndex}`} // More robust key to ensure proper re-render
              style={{
                transitionProperty: "opacity",
              }}
            />

            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg">
              {carouselIndex + 1} / {post.media.length}
            </div>

            {/* Navigation dots */}
            {post.media.length > 1 && (
              <div className="absolute left-0 right-0 bottom-8 flex justify-center pointer-events-none">
                <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center shadow-xl pointer-events-auto">
                  {post.media.map((_, index) => (
                    <button
                      key={index}
                      className={`h-3 w-3 mx-1.5 rounded-full transition-all duration-300 ${
                        index === carouselIndex
                          ? "bg-white scale-125 shadow-glow"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageLoading(true);
                        setCarouselIndex(index);
                      }}
                      aria-label={`Go to image ${index + 1}`}
                      aria-current={index === carouselIndex ? "true" : "false"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
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
