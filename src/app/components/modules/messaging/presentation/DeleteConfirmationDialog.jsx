import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/AlertDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
/**
 * @namespace messages
 * @module messages
 */
/**
 * DeleteConfirmationDialog
 *
 * A dialog that asks the user to confirm deletion of a conversation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {function} props.onClose - Callback when the dialog is closed.
 * @param {function} props.onConfirm - Callback when the user confirms deletion.
 * @param {string} props.participantName - Name of the participant in the conversation.
 * @param {boolean} [props.isDeleting=false] - Whether the deletion is in progress.
 */
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  participantName,
  isDeleting = false,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <DeleteOutlineIcon className="h-5 w-5 text-destructive" />
            <span className="text-text"> Delete Conversation </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your conversation with{" "}
            <span className="font-medium">{participantName}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-muted-foreground border-2 border-muted-foreground hover:bg-muted/50"
            disabled={isDeleting}
            data-testid="cancel-delete-conversation"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-background/80 hover:bg-destructive/90"
            data-testid="confirm-delete-conversation"
          >
            {isDeleting ? (
              <>
                <CircularProgress size={16} className="mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteConfirmationDialog;