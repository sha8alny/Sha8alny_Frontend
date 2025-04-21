export default function DeletePostPresentation({
  post,
  deletePost,
  isLoading,
  isError,
  error,
  onOpenChange,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted">
      {isLoading && <div className="size-12 border-t-transparent border-2 border-secondary animate-spin rounded-full" />}
      {isError && <p>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">Delete Post</h2>
          <p>Are you sure you want to delete this post?</p>
          <button
            onClick={() => {
              deletePost(post.postId);
              onOpenChange(false);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}