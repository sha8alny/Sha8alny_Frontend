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
    <div
      className="flex flex-col items-center justify-center p-6 w-full rounded-lg"
      data-testid="general-delete-root"
    >
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-8"
          data-testid="general-delete-loading"
        >
          <div
            className="size-14 border-t-4 border-t-transparent border-4 border-secondary animate-spin rounded-full"
            data-testid="general-delete-spinner"
          />
          <p
            className="text-primary font-medium text-lg mt-2 animate-pulse"
            data-testid="general-delete-loading-text"
          >
            {loadingText}
          </p>
        </div>
      ) : isError ? (
        <div
          className="w-full text-center py-6"
          data-testid="general-delete-error"
        >
          <div className="flex justify-center mb-4">
            <Error
              className="text-red-500"
              sx={{ fontSize: "3rem" }}
              data-testid="general-delete-error-icon"
            />
          </div>
          <h3
            className="text-lg font-semibold text-red-500 mb-2"
            data-testid="general-delete-error-title"
          >
            {errorTitle}
          </h3>
          <p
            className="text-gray-600 dark:text-gray-400"
            data-testid="general-delete-error-message"
          >
            {error?.message || errorMessage}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="mt-6 bg-primary hover:bg-primary/80 cursor-pointer text-background px-5 py-2 rounded-md transition-colors"
            data-testid="general-delete-error-close"
          >
            Close
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center w-full"
          data-testid="general-delete-confirm"
        >
          <div className="flex justify-center mb-4">
            <Icon
              className="text-red-500"
              sx={{ fontSize: "3rem" }}
              data-testid="general-delete-confirm-icon"
            />
          </div>
          <h2
            className="text-xl font-bold mb-2 text-primary"
            data-testid="general-delete-confirm-title"
          >
            {confirmTitle}
          </h2>
          <p
            className="text-muted text-center mb-6"
            data-testid="general-delete-confirm-message"
          >
            {confirmMessage}
          </p>

          <div className="flex gap-4 justify-center w-full mt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 px-4 border border-primary cursor-pointer bg-primary rounded-md font-semibold hover:bg-primary/80 text-background hover:dark:bg-primary/80 transition-colors"
              data-testid="general-delete-cancel"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={() => onConfirmDelete()}
              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-primary cursor-pointer font-semibold rounded-md transition-colors"
              data-testid="general-delete-confirm-btn"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
