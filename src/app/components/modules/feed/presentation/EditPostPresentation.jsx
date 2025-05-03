export default function EditPostPresentation({
  postText,
  setPostText,
  onEdit,
  isEditing,
  errorEditing,
}) {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="resize-none h-20 w-full border-0 bg-foreground text-primary rounded-lg p-2 focus:outline-none focus:ring-0"
        placeholder="What do you want to talk about?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        data-testid="post-textarea"
      />
      <button
        className="bg-secondary cursor-pointer text-background text-center rounded-lg p-2 hover:bg-secondary/80 duration-200"
        onClick={onEdit}
        disabled={isEditing}
        data-testid="edit-post-button"
      >
        {isEditing ? (
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-background" />
        ) : (
          "Edit Post"
        )}
      </button>
    </div>
  );
}
