import Button from "./Button";
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

const ChangeUsernameForm = ({ username, error, handleChange, handleSubmit, toggleForm, isLoading }) => {
  return (
    <SettingsFormLayout>
      <BackButton handler={toggleForm} />
      <div className="flex flex-col gap-1">
        <h1 className="text-text text-xl font-semibold">Change user name</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <label className="text-sm text-text flex" htmlFor="username">
            New user name <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            className="bg-background rounded-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-500">{error}</p>}

          <Button content="Save user name" handler={handleSubmit} disabled={isLoading | !username} />
        </form>
      </div>
    </SettingsFormLayout>
  );
};

export default ChangeUsernameForm;
