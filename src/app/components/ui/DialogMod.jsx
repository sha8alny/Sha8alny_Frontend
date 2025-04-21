import React from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/AlertDialog";
import { Button } from "@/app/components/ui/Button";
import { X } from "lucide-react";

const CloseButton = () => {
  return (
    <AlertDialogCancel className="font-bold text-foreground cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/20">
      <X className="size-6 text-primary" />
    </AlertDialogCancel>
  );
};

/**
 * A reusable Dialog component that wraps AlertDialog functionality.
 * @component
 * @param {Object} props - The component props
 * @param {boolean} [props.useRegularButton=false] - Whether to use a regular HTML button instead of Button component
 * @param {string} [props.buttonClass=""] - Additional CSS classes for the trigger button
 * @param {string} [props.className=""] - Additional CSS classes for the dialog content
 * @param {React.ReactNode} props.buttonData - Content to be displayed inside the trigger button
 * @param {React.ReactNode} [props.AlertTitle=<CloseButton />] - Content for the dialog title
 * @param {React.ReactNode} props.AlertContent - Content to be displayed in the dialog body
 * @param {string} [props.variant="default"] - Variant style for the trigger button
 * @param {string} [props.size="default"] - Size of the trigger button
 * @param {boolean} [props.disabled=false] - Whether the trigger button is disabled
 * @param {boolean} props.open - Controls the open state of the dialog
 * @param {Function} props.onOpenChange - Callback function when dialog open state changes
 * @returns {React.ReactElement} A dialog component with customizable trigger and content
 */
const Dialog = ({
  useRegularButton = false,
  buttonClass = "",
  className = "",
  buttonData,
  AlertTitle = <CloseButton />, // Default to CloseButton
  AlertContent,
  variant = "default",
  size = "default",
  disabled = false,
  open,
  onOpenChange,
}) => {
  const ButtonComponent = useRegularButton ? "button" : Button;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <ButtonComponent
          disabled={disabled}
          className={buttonClass}
          variant={variant}
          size={size}
        >
          {buttonData}
        </ButtonComponent>
      </AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{AlertTitle}</AlertDialogTitle>
          {AlertContent}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

Dialog.propTypes = {
  useRegularButton: PropTypes.bool,
  buttonClass: PropTypes.string,
  className: PropTypes.string,
  buttonData: PropTypes.node.isRequired,
  AlertTitle: PropTypes.node,
  AlertContent: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

export default React.memo(Dialog);