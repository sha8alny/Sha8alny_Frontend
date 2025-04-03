import { Send } from "@mui/icons-material";
import CommentContainer from "../container/CommentContainer";
import { CommentSkeleton } from "./CommentPresentation";

export default function CommentSectionPresentation({
  comments,
  isLoading,
  hasMore,
  loadMore,
  handleComment,
  comment,
  setComment,
  isSubmittingComment,
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
            <button
              onClick={handleComment}
              disabled={!comment || isSubmittingComment}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-background dark:text-primary px-3 py-1 rounded-md text-sm font-semibold hover:bg-secondary/70 cursor-pointer transition-colors`}
            >
              {isSubmittingComment ? (
                <div className="size-5 animate-spin border-2 border-primary rounded-full border-t-transparent" />
              ) : (
                <Send sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {comments?.map((comment) => (
          <CommentContainer key={comment.commentId} comment={comment} />
        ))}
        {isLoading && <CommentSkeleton />}
      </div>
      {hasMore && (
        <button className="text-primary font-semibold" onClick={loadMore}>
          Load More Comments
        </button>
      )}
    </section>
  );
}
