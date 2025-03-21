import { updateProfile } from "@/app/services/updateProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ api, data }) => updateProfile(api, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
    });
}

export default useUpdateProfile;