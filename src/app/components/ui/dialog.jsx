import React from 'react';
import PropTypes from 'prop-types';
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
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";

const CloseButton = () => {
    return (
        <AlertDialogCancel className="font-bold text-foreground">
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <line x1="20" y1="20" x2="80" y2="80" stroke="black" strokeWidth="5" />
                <line x1="80" y1="20" x2="20" y2="80" stroke="black" strokeWidth="5" />
            </svg>
        </AlertDialogCancel>
    );
};

const Dialog = ({
    useRegularButton = false,
    buttonClass = '',
    className = '',
    buttonData,
    AlertTitle = <CloseButton />, // Default to CloseButton
    AlertContent,
    variant = 'default',
    size = 'default',
    disabled = false,
    open,
    onOpenChange,
}) => {
    const ButtonComponent = useRegularButton ? 'button' : Button;

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
                    <AlertDialogDescription>{AlertContent}</AlertDialogDescription>
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