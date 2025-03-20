import { updateProfile } from "@/services/updateProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        ({ api, data }) => updateProfile(api, data),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["userProfile"]);
            }
        }
    );
    return mutation;
}

export default useUpdateProfile;