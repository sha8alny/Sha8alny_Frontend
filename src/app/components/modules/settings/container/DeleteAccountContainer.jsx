import { useQuery, useMutation } from "@tanstack/react-query";
import DeleteAccountPresentation from "../presentation/DeleteAccountPresentation";
import { fetchUser, deleteAccount } from "../../../../services/userMangment";
import { useRouter } from "next/navigation";
import {useToast} from '@/app/context/ToastContext'
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
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const router = useRouter();
  const showToast = useToast();
  const handleDeleteSucess = () => {
    router.push("/");
  }
  
  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      handleDeleteSucess();
    },
    onError: (error) => {
      showToast("Failed to delete account", false);
    },
  });
 
  return (  
    <DeleteAccountPresentation
      handleDeleteAccountForm={handleDeleteAccountForm}
      user={user}
      isLoading={isLoading}
      error={error}
      deleteAccountMutation={mutation}
    />
  );
};

export default DeleteAccountContainer;
