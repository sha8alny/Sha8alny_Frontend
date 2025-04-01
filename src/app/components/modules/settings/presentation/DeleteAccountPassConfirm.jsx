import { useState } from "react";
import BackButton from "./BackButton";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui/Button";
/**
 * @namespace settings
 * @module settings
 */
/**
 * DeleteAccountPassConfirmation component allows users to confirm their password before deleting their account.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleDeleteAccountForm - Function to handle the back button click event.
 * @param {Object} props.deleteAccountMutation - Mutation object to handle the account deletion process.
 * @param {Function} props.deleteAccountMutation.mutate - Function to trigger the account deletion with the provided password.
 *
 * @returns {JSX.Element} The rendered DeleteAccountPassConfirmation component.
 */

const DeleteAccountPassConfirmation = ({
  handleDeleteAccountForm,
  handleDeleteAccount,
  setPassword,
  password
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
      <BackButton handler={handleDeleteAccountForm} />
      
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-destructive">Delete account</h1>
        <p className="text-muted-foreground">Enter your password to close this account</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={!password.trim()}
          className="w-full cursor-pointer hover:bg-destructive/80 transition-colors duration-200"
        >
          Delete Account
        </Button>
      </form>
    </div>
  );
};

export default DeleteAccountPassConfirmation;