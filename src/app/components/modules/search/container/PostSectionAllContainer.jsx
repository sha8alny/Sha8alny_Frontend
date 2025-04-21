import PostsContainer from "../../feed/container/PostsContainer";
import FeedIcon from "@mui/icons-material/Feed";
const PostSectionAllContainer = ({ query }) => {
  return (
    <>
      <div className="bg-foreground flex flex-row rounded-lg p-4 text-text mx-auto mb-4 w-full max-w-3xl ">
        <div className="flex flex-row w-full items-center justify-between ">
          <h1 className="text-lg font-bold text-center flex items-center gap-1">
            <FeedIcon sx={{ fontSize: '1.125rem' }} /> Posts
          </h1>
          <p className="text-sm text-gray-500 ml-2 mt-1">
            Showing results for keyword <strong className="text-base">{query}</strong>
          </p>
        </div>
      </div>
      <PostsContainer keyword={query} />
    </>
  );
};

export default PostSectionAllContainer;
