import SettingsFormLayout from "./SettingsFormLayout";
import BackButton from "./BackButton";
import Button from "./Button";
import DeleteAccountPassConfirmation from "./DeleteAccountPassConfirm";
import { useState } from "react";
/**
 * DeleteAccountPresentation component renders a form for deleting a user account.
 * It displays a confirmation message and a button to proceed with the deletion process.
 * 
 * @component
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.handleDeleteAccountForm - Function to toggle the visibility of the form.
 * @param {Object} props.user - The user object containing user details.
 * @param {boolean} props.isLoading - Flag indicating if the user data is loading.
 * @param {Object} props.error - Error object if there is an error fetching user data.
 * @param {Function} props.deleteAccountMutation - Mutation function to delete the user account.
 * 
 * @returns {JSX.Element} The rendered DeleteAccountPresentation component.
 */
const DeleteAccountPresentation = ({
  handleDeleteAccountForm,
  user,
  isLoading,
  error,
  deleteAccountMutation,
}) => {
  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p>Error fetching user data.</p>;
  const [currentFormPage, setCurrentFormPage] = useState(0);
  const handleContinueForm = () => setCurrentFormPage(1);
  
  return (
    <SettingsFormLayout>
      {currentFormPage === 1 ? (
        <DeleteAccountPassConfirmation
          handleDeleteAccountForm={handleDeleteAccountForm}
          deleteAccountMutation={deleteAccountMutation}
        />
      ) : (
        <>
          <BackButton handler={handleDeleteAccountForm} />
          <div className="flex flex-col gap-2">
            <h1 className="text-primary text-xl font-semibold">
              Delete account
            </h1>
            <p className="text-text text-sm">
              {user?.name}, we’re sorry to see you go
            </p>
          </div>
          <p className="text-gray-500">
            Are you sure you want to close your account? You’ll lose your
            connections, messages, endorsements, and recommendations.
          </p>
          <Button content="Continue" handler={handleContinueForm} />
        </>
      )}
    </SettingsFormLayout>
  );
};

export default DeleteAccountPresentation;
