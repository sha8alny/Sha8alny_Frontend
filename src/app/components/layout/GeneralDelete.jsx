import { Delete, Error } from "@mui/icons-material";

export default function GeneralDeletePresentation({
  onConfirmDelete,
  isLoading,
  isError,
  error,
  onOpenChange,
  itemType = "item",
  loadingText = `Deleting ${itemType}...`,
  errorTitle = "Error",
  errorMessage = `Failed to delete ${itemType}`,
  confirmTitle = `Delete`,
  confirmMessage = `This action cannot be undone. Are you sure you want to delete this ${itemType}?`,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  Icon = Delete,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full rounded-lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="size-14 border-t-4 border-t-transparent border-4 border-secondary animate-spin rounded-full" />
          <p className="text-primary font-medium text-lg mt-2 animate-pulse">
            {loadingText}
          </p>
        </div>
      ) : isError ? (
        <div className="w-full text-center py-6">
          <div className="flex justify-center mb-4">
            <Error className="text-red-500" sx={{ fontSize: "3rem" }} />
          </div>
          <h3 className="text-lg font-semibold text-red-500 mb-2">{errorTitle}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || errorMessage}
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
            <Icon className="text-red-500" sx={{ fontSize: "3rem" }} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-primary">{confirmTitle}</h2>
          <p className="text-muted text-center mb-6">
            {confirmMessage}
          </p>

          <div className="flex gap-4 justify-center w-full mt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 px-4 border border-primary cursor-pointer bg-primary rounded-md font-semibold hover:bg-primary/80 text-background hover:dark:bg-primary/80 transition-colors"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={() => onConfirmDelete()}
              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-primary cursor-pointer font-semibold rounded-md transition-colors"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}