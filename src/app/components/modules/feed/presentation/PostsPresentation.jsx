import PostContainer from "../container/PostContainer";

export default function PostsPresentation({ posts }) {
  return posts.map((post) => <PostContainer key={post.id} post={post} />);
}
