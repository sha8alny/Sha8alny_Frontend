import PostContainer from "../container/PostContainer";
import { PostSkeleton } from "./PostPresentation";

export default function PostsPresentation({
  posts,
  isFetchingNextPage,
  lastElementRef,
}) {
  return (
    <>
      {posts
        .filter((post) => post)
        .map((post, index) => {
          if (index === posts.length - 1) {
            // Apply the ref to the last post
            return (
              <div
                ref={lastElementRef}
                key={post.postId + post.isShared?.username}
                data-testid="posts-presentation-last-item"
              >
                <PostContainer
                  post={post}
                  data-testid="posts-presentation-post-item"
                />
              </div>
            );
          } else {
            return (
              <PostContainer
                key={post.postId + post.isShared?.username}
                post={post}
                data-testid="posts-presentation-post-item"
              />
            );
          }
        })}
      {isFetchingNextPage && (
        <PostSkeleton data-testid="posts-presentation-loading" />
      )}
    </>
  );
}
