import Container from "@/app/components/layout/Container";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { CommentOutlined, FavoriteBorder, Repeat } from "@mui/icons-material";

export default function PostPresentation({
  post,
  navigateTo,
  isVideo,
  isDocument,
}) {
    console.log(post.text, isVideo, isDocument);
  return (
    <Container
      onClick={() => navigateTo(`${post?.username}/post/${post?.postId}`)}
      className="p-4 flex flex-col hover:bg-primary/10 cursor-pointer duration-200"
    >
      <section className="flex gap-2 items-center">
        <Avatar
          className="size-7 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(post?.username);
          }}
          data-testid={`connection-avatar-${post?.username}`}
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
              data-testid={`post-name-${post?.username}`}
            >
              {post?.fullName}
            </h5>
            <p className="text-xs text-muted truncate">{post?.age}</p>
          </div>
          <h6 className="text-xs text-muted">{post?.headline}</h6>
        </div>
      </section>
      <div className="mt-4 flex flex-col items-center">
        <p className="text-xs text-primary break-all self-start">
          {post?.text}
        </p>
        {isDocument && (
          <iframe
            className="w-full aspect-square px-2 mt-4 rounded-lg"
            src={post?.media[0]}
            title="Document"
            sandbox="allow-scripts"
          />
        )}
        {isVideo && (
          <video
            className="w-full aspect-square mt-4 rounded-lg"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay={false}
            loop={false}
            muted={true}
            poster={post.media[0]}
            src={post?.media[0]}
          />
        )}
        {post?.media[0] && !isVideo && !isDocument && (
          <img
            className="w-full px-2 mt-4 rounded-lg"
            src={post?.media[0]}
            alt="Post Media"
          />
        )}
      </div>
      <div className="flex flex-col mt-auto">
        <div className="flex flex-wrap gap-2 pt-2">
          {post?.keywords?.slice(0,5).map((keyword, index) => (
            <span
              key={index}
              className="text-xs text-background bg-secondary rounded-full px-2 py-1"
            >
              #{keyword}
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs flex">
            <FavoriteBorder
              className="text-primary"
              sx={{ fontSize: "1rem" }}
            />
            <span className="text-primary text-xs ml-1">{post?.numReacts}</span>
          </span>
          <span className="text-xs flex">
            <CommentOutlined
              className="text-primary"
              sx={{ fontSize: "1rem" }}
            />
            <span className="text-primary text-xs ml-1">
              {post?.numComments}
            </span>
          </span>
          <span className="text-xs flex">
            <Repeat className="text-primary" sx={{ fontSize: "1rem" }} />
            <span className="text-primary text-xs ml-1">{post?.numShares}</span>
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
