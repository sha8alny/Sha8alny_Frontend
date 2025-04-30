import Container from "@/app/components/layout/Container";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import SafeVideo from "@/app/components/ui/SafeVideo";
import {
  CommentOutlined,
  Description,
  FavoriteBorder,
  Repeat,
} from "@mui/icons-material";

export default function PostPresentation({
  post,
  navigateTo,
  isVideo,
  isDocument,
}) {
  return (
    <Container
      onClick={() => navigateTo(`${post?.username}/post/${post?.postId}`)}
      className="p-4 flex flex-col hover:bg-primary/15 cursor-pointer duration-200 shadow-md"
      data-testid={`post-container-${post?.postId}`}
    >
      {post?.isShared && (
        <div
          className="flex items-center gap-1 mb-2 text-xs pb-2"
          data-testid={`post-shared-${post?.postId}`}
        >
          <Avatar
            className="size-5"
            data-testid={`post-shared-avatar-${post?.postId}`}
          >
            <AvatarImage src={post?.isShared?.profilePicture} alt="Shared by" />
            <AvatarFallback>
              {post?.isShared?.fullName?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h5
            className="font-semibold"
            data-testid={`post-shared-fullname-${post?.postId}`}
          >
            {post?.isShared?.fullName}
          </h5>
          <span data-testid={`post-shared-label-${post?.postId}`}>
            shared this
          </span>
        </div>
      )}
      <section
        className="flex gap-2 items-center"
        data-testid={`post-header-${post?.postId}`}
      >
        <Avatar
          className="size-7 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(post?.username);
          }}
          data-testid={`post-avatar-${post?.username}`}
        >
          <AvatarImage src={post?.profilePicture} alt={post?.name} />
          <AvatarFallback>
            {post?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center gap-2 w-full">
            <h5
              className="font-semibold text-sm cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(post?.username);
              }}
              data-testid={`post-fullname-${post?.username}`}
            >
              {post?.fullName}
            </h5>
            <p
              className="text-xs text-muted truncate"
              data-testid={`post-age-${post?.postId}`}
            >
              {post?.age}
            </p>
          </div>
          <h6
            className="text-xs text-muted"
            data-testid={`post-headline-${post?.username}`}
          >
            {post?.headline}
          </h6>
        </div>
      </section>
      <div
        className="mt-4 flex flex-col items-center"
        data-testid={`post-content-${post?.postId}`}
      >
        <p
          className="text-xs text-primary break-all self-start"
          data-testid={`post-text-${post?.postId}`}
        >
          {post?.text}
        </p>
        {isDocument && (
          <div
            className="w-full aspect-square bg-primary/5 flex flex-col items-center justify-center p-4 mt-4 rounded-lg border border-dashed border-primary/50"
            data-testid={`post-document-preview-${post?.postId}`}
          >
            <Description
              className="text-primary/70"
              sx={{ fontSize: "3rem" }}
              data-testid={`post-document-icon-${post?.postId}`}
            />
            <span
              className="text-xs text-primary/70 mt-2 text-center break-all"
              data-testid={`post-document-label-${post?.postId}`}
            >
              Document
            </span>
          </div>
        )}
        {isVideo && (
          <SafeVideo
            className="w-full aspect-square mt-4 rounded-lg"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay={false}
            loop={false}
            muted={true}
            poster={post.media[0]}
            src={post?.media[0]}
            data-testid={`post-video-${post?.postId}`}
          />
        )}
        {post?.media[0] && !isVideo && !isDocument && (
          <img
            className="w-full px-2 mt-4 rounded-lg"
            src={post?.media[0]}
            alt="Post Media"
            data-testid={`post-image-${post?.postId}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.svg";
            }}
          />
        )}
      </div>
      <div
        className="flex flex-col mt-auto"
        data-testid={`post-footer-${post?.postId}`}
      >
        <div
          className="flex flex-wrap gap-2 pt-2"
          data-testid={`post-keywords-${post?.postId}`}
        >
          {post?.keywords?.slice(0, 5).map((keyword, index) => (
            <span
              key={index}
              className="text-xs text-background bg-secondary rounded-full px-2 py-1"
              data-testid={`post-keyword-${post?.postId}-${index}`}
            >
              #{keyword}
            </span>
          ))}
        </div>
        <div
          className="flex justify-between mt-2"
          data-testid={`post-stats-${post?.postId}`}
        >
          <span
            className="text-xs flex"
            data-testid={`post-reacts-${post?.postId}`}
          >
            <FavoriteBorder
              className="text-primary"
              sx={{ fontSize: "1rem" }}
              data-testid={`post-reacts-icon-${post?.postId}`}
            />
            <span
              className="text-primary text-xs ml-1"
              data-testid={`post-reacts-count-${post?.postId}`}
            >
              {post?.numReacts}
            </span>
          </span>
          <span
            className="text-xs flex"
            data-testid={`post-comments-${post?.postId}`}
          >
            <CommentOutlined
              className="text-primary"
              sx={{ fontSize: "1rem" }}
              data-testid={`post-comments-icon-${post?.postId}`}
            />
            <span
              className="text-primary text-xs ml-1"
              data-testid={`post-comments-count-${post?.postId}`}
            >
              {post?.numComments}
            </span>
          </span>
          <span
            className="text-xs flex"
            data-testid={`post-shares-${post?.postId}`}
          >
            <Repeat
              className="text-primary"
              sx={{ fontSize: "1rem" }}
              data-testid={`post-shares-icon-${post?.postId}`}
            />
            <span
              className="text-primary text-xs ml-1"
              data-testid={`post-shares-count-${post?.postId}`}
            >
              {post?.numShares}
            </span>
          </span>
        </div>
      </div>
    </Container>
  );
}

export function PostPresentationSkeleton({ isLoading = true }) {
  return (
    <Container className="p-4 flex flex-col gap-2">
      <section className="flex gap-2 items-center">
        <Avatar className="size-7 cursor-pointer">
          <AvatarFallback
            className={`${
              isLoading && "animate-pulse"
            } bg-primary/60 size-7 rounded-full`}
          />
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-center gap-2 w-full">
            <h5
              className={`${
                isLoading && "animate-pulse"
              } bg-primary/60 h-4 w-1/2 rounded-2xl`}
            />
            <p
              className={`${
                isLoading && "animate-pulse"
              } bg-primary/60 h-3 w-1/4 rounded-2xl`}
            />
          </div>
          <h6
            className={`${
              isLoading && "animate-pulse"
            } bg-primary/60 h-3 w-1/3 rounded-2xl`}
          />
        </div>
      </section>
      <div className="mt-4 flex flex-col items-center">
        <p
          className={`${
            isLoading && "animate-pulse"
          } bg-primary/60 h-4 w-full rounded-2xl`}
        />
        <div
          className={`${
            isLoading && "animate-pulse"
          } bg-primary/60 h-40 w-full mt-2 rounded-lg`}
        />
      </div>
    </Container>
  );
}
