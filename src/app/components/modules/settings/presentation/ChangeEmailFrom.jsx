import BackButton from "./BackButton";
import Button from "./Button";
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
}) => {
  return (
    <div className="text-text flex flex-col gap-4 bg-foreground rounded-lg w-full max-w-[725px] mx-auto font-sans">
      <BackButton handler={toggleForm} />
      <h1 className="text-text text-xl font-semibold">Add email address</h1>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <label className="text-sm text-text flex">
          Enter new email address <span className="ml-1 text-red-500"> *</span>
        </label>
        <input
          className={`bg-background rounded-lg p-1 ${
            errors.email ? "border border-red-500" : ""
          }`}
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <label className="text-sm text-text flex">
          Enter your password <span className="ml-1 text-red-500"> *</span>
        </label>
        <input
          className={`bg-background rounded-lg p-1 ${
            errors.password ? "border border-red-500" : ""
          }`}
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </form>
      <Button
        content={isLoading ? "Updating..." : "Add Email"}
        handler={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
};

export default ChangeEmailForm;
