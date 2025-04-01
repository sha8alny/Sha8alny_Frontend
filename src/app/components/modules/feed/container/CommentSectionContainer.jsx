import { getCommentReplies } from "@/app/services/post";

export default function CommentSectionContainer({ postId }) {
  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => getCommentReplies(postId, null, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });
  const comments = data?.pages?.flatMap((page) => page) || [];
  const isLoading = isLoadingComments || isFetchingNextPage;
  const hasMore = hasNextPage && !isLoadingComments;
  const loadMore = () => {
    if (hasMore) {
      fetchNextPage();
    }
  };
  return (
    <CommentSectionPresentation
      comments={comments}
      isLoading={isLoading}
      hasMore={hasMore}
      loadMore={loadMore}
    />
  );
}
