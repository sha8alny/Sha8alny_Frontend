import { Shield, Close } from "@mui/icons-material";
import SettingsFormLayout from "./SettingsFormLayout";
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
 * ChangePasswordForm component allows users to change their password.
 *
 * @component
 * @param {Object} props - The props that are passed to the component.
 * @param {Function} props.toggleForm - Function to toggle the form visibility.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleChange - Function to handle input changes.
 * @param {Object} props.errors - Object containing error messages for the form fields.
 * @param {Object} props.passwords - Object containing the current, new, and confirm password values.
 * @param {boolean} props.showTooltip - Boolean to control the visibility of the tooltip.
 * @param {Function} props.setShowTooltip - Function to set the visibility of the tooltip.
 * @param {Object} props.tooltipRef - Ref object for the tooltip element.
 * @param {Function} props.handleForgetPassword - Function to handle forgot password action.
 * @param {boolean} props.hasPassword - Whether the user has a password set.
 * @returns {JSX.Element} The ChangePasswordForm component.
 */

const ChangePasswordForm = ({
  toggleForm,
  handleSubmit,
  handleChange,
  errors,
  passwords,
  showTooltip,
  setShowTooltip,
  tooltipRef,
  handleForgetPassword,
  hasPassword,
}) => {
  if (!hasPassword) {
    return (
      <SettingsFormLayout>
        <BackButton handler={toggleForm} />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-text text-lg font-semibold">Set Password</h1>
            <p className="text-sm">You need to set a password for your account first.</p>
          </div>

          <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              For security purposes, you must set a password for your account to protect your information.
              <Link href="/forget-password" className="ml-1 font-medium text-secondary hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
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
      </SettingsFormLayout>
    );
  }

  return (
    <SettingsFormLayout>
      <BackButton handler={toggleForm} />
      <div className="flex flex-col gap-1">
        <h1 className="text-text text-lg font-semibold">Change Password</h1>
        <p className="text-sm">
          Create a new password that is at least 8 characters long.
        </p>

        <div className="relative w-max">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-sm text-secondary w-max rounded-full hover:bg-[#0A66C233] p-2 cursor-pointer flex flex-row gap-2 items-center"
          >
            <Shield /> What makes a strong password?
          </button>

          {showTooltip && (
            <div
              ref={tooltipRef}
              className="absolute left-0 top-full mt-2 w-80 bg-background text-text rounded-lg p-4 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Choose a strong password</h3>
                <button onClick={() => setShowTooltip(false)}>
                  <Close
                    size={18}
                    className=" cursor-pointer hover:text-secondary"
                  />
                </button>
              </div>
              <ul className="mt-2 text-sm flex flex-col gap-2 list-none ">
                <li>
                  It <b>should</b> be a mix of letters, numbers, and special
                  characters.
                </li>
                <li>
                  It <b>should</b> be at least 8 characters long.
                </li>
                <li>
                  It <b>should not</b> contain your name, phone number, or email
                  address.
                </li>
              </ul>
            </div>
          )}
        </div>

        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="flex items-center">
              Type your current password{" "}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              data-testid="currentPassword-input"
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              required
              className={errors.currPassError ? "border-destructive" : ""}
            />
            {errors.currPassError && (
              <p className="text-sm text-destructive">{errors.currPassError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center">
              Type your new password{" "}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              type="password"
              data-testid="newPassword-input"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              required
              className={errors.newPassError ? "border-destructive" : ""}
            />
            {errors.newPassError && (
              <p className="text-sm text-destructive">{errors.newPassError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center">
              Retype the password
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              type="password"
              data-testid="confirmPassword-input"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
              className={errors.confirmPassError ? "border-destructive" : ""}
            />
            {errors.confirmPassError && (
              <p className="text-sm text-destructive">
                {errors.confirmPassError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-testid="new-password-submit-button"
            className="w-full bg-secondary text-background cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
            disabled={
              !passwords.currentPassword ||
              !passwords.newPassword ||
              !passwords.confirmPassword
            }
          >
            Save Password
          </Button>
        </form>
        <button
          data-testid="forgot-password-button"
          onClick={handleForgetPassword}
          className="cursor-pointer w-max hover:text-secondary p-2 rounded-lg"
        >
          Forgot Password
        </button>
      </div>
    </SettingsFormLayout>
  );
};

export default ChangePasswordForm;
