import { useState } from "react";
import BackButton from "./BackButton";
import Button from "./Button";
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
  deleteAccountMutation,
  handleDeleteAccount,
  setPassword,
  password
}) => {
 

  return (
    <div className="text-text flex flex-col gap-4 bg-foreground rounded-lg w-full max-w-[725px] mx-auto font-sans">
      <BackButton handler={handleDeleteAccountForm} />
      <h1 className="text-primary text-xl font-semibold">Delete account</h1>
      <p className="text-text text-lg">Enter your password to close this account</p>
      <form className="flex flex-col gap-1">
        <label className="text-sm text-text flex flex-col gap-2">Password
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background rounded-lg p-2"
          type="password"
        />
        </label>
      </form>
      <Button content="Delete account" handler={handleDeleteAccount} disabled={!password.trim()} />
      </div>
  );
};

export default DeleteAccountPassConfirmation;
