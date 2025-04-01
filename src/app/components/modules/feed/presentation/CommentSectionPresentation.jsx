import CommentContainer from "../container/CommentContainer";
import { CommentSkeleton } from "./CommentPresentation";

export default function CommentSectionPresentation({
  comments,
  isLoading,
  hasMore,
  loadMore,
}) {
    return (
        <section className="flex flex-col gap-4 w-full mt-4">
            {comments?.map((comment) => (
            <CommentContainer key={comment.id} comment={comment} />
            ))}
            {isLoading && <CommentSkeleton />}
            {hasMore && (
            <button
                className="text-primary font-semibold"
                onClick={loadMore}
            >
                Load More Comments
            </button>
            )}
        </section>
    )
}
