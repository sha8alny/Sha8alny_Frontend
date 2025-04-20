import { useQuery, useMutation } from "@tanstack/react-query";
import DeleteAccountPresentation from "../presentation/DeleteAccountPresentation";
import { getName, deleteAccount } from "../../../../services/userManagement";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import { useState } from "react";
/**
 * @namespace settings
 * @module settings
 */
/**
 * DeleteAccountContainer component handles the logic for deleting a user account.
 * It fetches the user data, manages the delete account mutation, and handles success and error scenarios.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleDeleteAccountForm - Function to toggle the visibility of the form.
 * @returns {JSX.Element} The rendered DeleteAccountPresentation component.
 *
 */

const DeleteAccountContainer = ({ handleDeleteAccountForm }) => {
  const {
    data: data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["name-settings"],
    queryFn: getName,
  });

  const router = useRouter();

  const showToast = useToast();
  const handleDeleteSucess = () => {
    router.push("/signin");
  };

  const [password, setPassword] = useState("");
  const [currentFormPage, setCurrentFormPage] = useState(0);
  const handleContinueForm = () => setCurrentFormPage(1);

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      handleDeleteSucess();
    },
    onError: (error) => {
       console.log(error);
      showToast(error.message, false);
    },
  });

  const handleDeleteAccount = async () => {
    deleteAccountMutation.mutate(password);
  };

  return (
    <DeleteAccountPresentation
      handleDeleteAccountForm={handleDeleteAccountForm}
      name={data?.name}
      isLoading={isLoading}
      error={error}
      deleteAccountMutation={deleteAccountMutation}
      handleContinueForm={handleContinueForm}
      currentFormPage={currentFormPage}
      handleDeleteAccount={handleDeleteAccount}
      setPassword={setPassword}
      password={password}
    />
  );
};

export default DeleteAccountContainer;
