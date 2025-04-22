import { ExpandMore, Send } from "@mui/icons-material";
import CommentContainer from "../container/CommentContainer";
import { CommentSkeleton } from "./CommentPresentation";
import { Button } from "@/app/components/ui/Button";

export default function CommentSectionPresentation({
  comments,
  isLoading,
  hasMore,
  loadMore,
  handleComment,
  comment,
  setComment,
  isSubmittingComment,
  postId,
  navigateTo,
  isPost,
  isLoadingComments,
  postUsername
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <div className="flex items-center gap-3 w-full p-3 drop-shadow-sm">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full py-2 text-primary px-4 bg-foreground rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button
              variant="icon"
              onClick={handleComment}
              disabled={!comment || isSubmittingComment}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-secondary disabled:cursor-default text-background dark:text-primary rounded-md text-sm font-semibold hover:bg-secondary/70 cursor-pointer transition-colors`}
            >
              {isSubmittingComment ? (
                <div className="size-5 animate-spin border-2 border-primary rounded-full border-t-transparent" />
              ) : (
                <Send sx={{ fontSize: "1rem" }} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-4 px-4">
        {comments?.map((comment) => (
          <CommentContainer
            key={comment.commentId}
            comment={comment}
            postId={postId}
            postUsername={postUsername}
            nestCount={0}
          />
        ))}
        {isLoading && Array.from({length: 2}).map((_, index) => (<CommentSkeleton key={index} />))}
        {isLoadingComments && Array.from({length: 2}).map((_, index) => (<CommentSkeleton key={index} />))}
      </div>
      {hasMore && !isLoadingComments && (
        <button
          className="text-primary font-semibold text-sm flex gap-1 items-center group justify-center cursor-pointer"
          onClick={comments?.length > 5 && !isPost ? navigateTo : loadMore}
        >
          <ExpandMore sx={{ fontSize: "1rem" }} />
          <span className="group-hover:underline">Load more comments</span>
        </button>
      )}
    </section>
  );
}
