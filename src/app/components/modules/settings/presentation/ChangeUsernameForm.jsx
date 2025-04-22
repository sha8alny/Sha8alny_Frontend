import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui/Button";
import BackButton from "./BackButton";
import SettingsFormLayout from "./SettingsFormLayout";
/**
 * @namespace settings
 * @module settings
 */
/**
 * ChangeUsernameForm component allows users to change their username.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.username - The current username value.
 * @param {string} [props.error] - The error message to display if there's an error.
 * @param {Function} props.handleChange - The function to handle changes in the username input field.
 * @param {Function} props.handleSubmit - The function to handle the form submission.
 * @param {Function} props.toggleForm - The function to toggle the form visibility.
 * @param {boolean} props.isLoading - The loading state to disable the submit button when necessary.
 * @returns {JSX.Element} The rendered ChangeUsernameForm component.
 */



const ChangeUsernameForm = ({ 
  username, 
  error, 
  handleChange, 
  handleSubmit, 
  toggleForm, 
  isLoading 
}) => {
  return (
    <SettingsFormLayout>
      <BackButton handler={toggleForm} />
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Change user name</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center">
              New user name <span className=" text-destructive">*</span>
            </Label>
            <Input
              id="username"
              name="username"
              data-testid="username-change-input"
              value={username}
              onChange={handleChange}
              required
              className={`${error ? "border-destructive" : ""}`}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !username}
            data-testid="username-change-submit"
            className="w-full text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
          >
            {isLoading ? "Saving..." : "Save user name"}
          </Button>
        </form>
      </div>
    </SettingsFormLayout>
  );
};

export default ChangeUsernameForm;