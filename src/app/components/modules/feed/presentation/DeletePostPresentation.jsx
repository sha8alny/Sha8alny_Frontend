import { Delete, Error } from "@mui/icons-material";

export default function DeletePostPresentation({
  deletePost,
  isLoading,
  isError,
  error,
  onOpenChange,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full rounded-lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="size-14 border-t-4 border-t-transparent border-4 border-secondary animate-spin rounded-full" />
          <p className="text-primary font-medium text-lg mt-2 animate-pulse">
            Deleting post...
          </p>
        </div>
      ) : isError ? (
        <div className="w-full text-center py-6">
          <div className="flex justify-center mb-4">
            <Error className="text-red-500" sx={{ fontSize: "3rem" }} />
          </div>
          <h3 className="text-lg font-semibold text-red-500 mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "Failed to delete post"}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="mt-6 bg-primary hover:bg-primary/80 cursor-pointer text-background px-5 py-2 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center mb-4">
            <Delete className="text-red-500" sx={{ fontSize: "3rem" }} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-primary">Delete Post</h2>
          <p className="text-muted text-center mb-6">
            This action cannot be undone. Are you sure you want to delete this
            post?
          </p>

          <div className="flex gap-4 justify-center w-full mt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 px-4 border border-primary cursor-pointer bg-primary rounded-md font-semibold hover:bg-primary/80 text-background hover:dark:bg-primary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deletePost()}
              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-primary cursor-pointer font-semibold rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
