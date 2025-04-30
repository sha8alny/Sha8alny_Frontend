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
 * ChangeEmailForm component allows users to change their email address by providing a new email and their password.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.toggleForm - Function to toggle the form visibility.
 * @param {string} props.email - The current email value.
 * @param {Function} props.setEmail - Function to set the email value.
 * @param {string} props.password - The current password value.
 * @param {Function} props.setPassword - Function to set the password value.
 * @param {Object} props.errors - Object containing validation errors for email and password.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {boolean} props.isLoading - Boolean indicating if the form is in a loading state.
 * @param {boolean} props.hasPassword - Boolean indicating if the user has a password set.
 *
 * @returns {JSX.Element} The ChangeEmailForm component.
 */

const ChangeEmailForm = ({
  toggleForm,
  email,
  setEmail,
  password,
  setPassword,
  errors,
  handleSubmit,
  isLoading,
  hasPassword,
}) => {
  if (!hasPassword) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
        <BackButton handler={toggleForm} />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Password Required</h1>
          <p className="text-muted-foreground">You need to set a password before you can update your email.</p>
        </div>

        <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            For security reasons, you need to set a password before changing your email address. 
            <Link href="/forget-password" className="ml-1 font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
              Set a password now
            </Link>
          </p>
        </div>

        <Button
          type="button"
          onClick={toggleForm}
          className="w-full bg-secondary text-background cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
      <BackButton handler={toggleForm} />
      <h1 className="text-xl font-semibold">Add email address</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label className="flex items-center">
            Enter new email address <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="email"
            data-testid="new-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center">
            Enter your password <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="password"
            data-testid="password-input-email"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button 
          type="submit" 
          data-testid="update-email-button"
          disabled={isLoading}
          className="w-full bg-secondary text-background cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
        >
          {isLoading ? "Validating..." : "Add Email"}
        </Button>
      </form>
    </div>
  );
};

export default ChangeEmailForm;