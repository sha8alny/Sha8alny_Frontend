import BackButton from "./BackButton";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

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
 * @param {boolean} props.hasPassword - Whether the user has a password set.
 *
 * @returns {JSX.Element} The rendered DeleteAccountPassConfirmation component.
 */

const DeleteAccountPassConfirmation = ({
  handleDeleteAccountForm,
  handleDeleteAccount,
  setPassword,
  password,
  hasPassword,
}) => {
  // If user doesn't have a password, show a different UI
  if (!hasPassword) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
        <BackButton data-testid="back-delete-pass" handler={handleDeleteAccountForm} />
        
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-destructive">Password Required</h1>
          <p className="text-muted-foreground">You need to set a password before you can delete your account</p>
        </div>

        <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            For security reasons, you need to set a password before deleting your account. 
            <Link href="/forget-password" className="ml-1 font-medium text-secondary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300 underline">
              Set a password now
            </Link>
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDeleteAccountForm}
          className="w-full cursor-pointer bg-secondary text-background hover:bg-secondary/80 transition-colors duration-200"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
      <BackButton data-testid="back-delete-pass" handler={handleDeleteAccountForm} />
      
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-destructive">Delete account</h1>
        <p className="text-muted-foreground">Enter your password to close this account</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            data-testid="password-delete"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </div>

        <Button
          type="button"
          variant="destructive"
          data-testid="delete-account-button"
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