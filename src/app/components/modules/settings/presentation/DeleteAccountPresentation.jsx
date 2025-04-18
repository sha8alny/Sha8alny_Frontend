import SettingsFormLayout from "./SettingsFormLayout";
import BackButton from "./BackButton";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui/Button";
import DeleteAccountPassConfirmation from "./DeleteAccountPassConfirm";
/**
 * @namespace settings
 * @module settings
 */
/**
 * DeleteAccountPresentation component renders a form for deleting a user account.
 * It displays a confirmation message and a button to proceed with the deletion process.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleDeleteAccountForm - Function to toggle the visibility of the form.
 * @param {Object} props.name - The user name.
 * @param {boolean} props.isLoading - Flag indicating if the user data is loading.
 * @param {Object} props.error - Error object if there is an error fetching user data.
 * @param {Function} props.deleteAccountMutation - Mutation function to delete the user account.
 *
 * @returns {JSX.Element} The rendered DeleteAccountPresentation component.
 */
const DeleteAccountPresentation = ({
  handleDeleteAccountForm,
  name,
  isLoading,
  error,
  deleteAccountMutation,
  handleContinueForm,
  currentFormPage,
  handleDeleteAccount,
  setPassword,
  password,
}) => {
  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className="w-10 h-10 border-4 border-t-transparent border-secondary rounded-full animate-spin" role="status" aria-label="Loading" />
    </div>
  );
  
  if (error) return <p className="flex justify-center items-center h-full text-red">Error fetching user data.</p>;

  return (
    <SettingsFormLayout>
      {currentFormPage === 1 ? (
        <DeleteAccountPassConfirmation
          handleDeleteAccountForm={handleDeleteAccountForm}
          deleteAccountMutation={deleteAccountMutation}
          handleDeleteAccount={handleDeleteAccount}
          setPassword={setPassword}
          password={password}
        />
      ) : (
        <>
          <BackButton data-testid="back-delete" handler={handleDeleteAccountForm} />
          <div className="flex flex-col gap-2">
            <h1 className="text-primary text-xl font-semibold">
              Delete account
            </h1>
            <p className="text-text text-sm">
              {name}, we’re sorry to see you go
            </p>
          </div>
          <p className="text-gray-500">
            Are you sure you want to close your account? You’ll lose your
            connections, messages, endorsements, and recommendations.
          </p>
          <Button data-testid="continue-delete" className="w-25 bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200" onClick={handleContinueForm}>Continue</Button>
        </>
      )}
    </SettingsFormLayout>
  );
};

export default DeleteAccountPresentation;
