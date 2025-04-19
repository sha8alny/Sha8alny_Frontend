"use client"

import { Button } from "@/app/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog"
import { Loader2 } from "lucide-react"

/**
 * ConfirmationModal component displays a modal to confirm subscription cancellation
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls if the modal is displayed
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onConfirm - Function called when cancellation is confirmed
 * @param {boolean} props.isLoading - Indicates if the cancellation process is in progress
 * @returns {JSX.Element} The modal component
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  return (
    <Dialog className="text-text" open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? You will lose access to premium features when your
            current billing period ends.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-6">
          <Button className="text-text cursor-pointer" variant="outline" onClick={onClose} disabled={isLoading}>
            Keep Subscription
          </Button>
          <Button className="cursor-pointer bg-red-700 font-semibold hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300"  onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Yes, Cancel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
