import PostContainer from "../container/PostContainer";
import { PostSkeleton } from "./PostPresentation";

/**
 * PostsPresentation - Renders a list of posts with infinite scrolling
 * 
 * This component is responsible for:
 * - Displaying a list of post items using PostContainer
 * - Implementing infinite scrolling with Intersection Observer
 * - Showing loading states during pagination
 * - Handling the ref attachment for the last post element
 * 
 * It's a pure presentation component that receives filtered and processed
 * post data and pagination handlers from its container.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.posts - Array of post data objects to display
 * @param {boolean} props.isFetchingNextPage - Whether additional posts are being fetched
 * @param {Function} props.lastElementRef - Ref callback for infinite scrolling
 * @returns {JSX.Element} List of posts with loading indicators
 */
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
