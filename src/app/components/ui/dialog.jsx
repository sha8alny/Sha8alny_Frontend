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
    <AlertDialogCancel className="font-bold text-foreground">
      <X className="size-6 text-primary" />
    </AlertDialogCancel>
  );
};

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
