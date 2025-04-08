import PostContainer from "../container/PostContainer";
import { PostSkeleton } from "./PostPresentation";

export default function PostsPresentation({
  posts,
  isFetchingNextPage,
  lastElementRef,
}) {
  console.log("PostsPresentation", posts, isFetchingNextPage);
  return (
    <>
      {posts.filter(post => post).map((post, index) => {
        if (index === posts.length - 1) {
          // Apply the ref to the last post
          return <div ref={lastElementRef} key={post.postId}><PostContainer post={post} /></div>;
        } else {
          return <PostContainer key={post.postId} post={post} />;
        }
      })}
      {isFetchingNextPage && <PostSkeleton />}
    </>
  );
}
