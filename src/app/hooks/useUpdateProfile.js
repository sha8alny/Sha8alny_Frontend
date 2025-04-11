import { updateProfile } from "@/app/services/updateProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ api, data, method, isFormData = false }) => 
            updateProfile(api, data, method, isFormData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
    });
}

export default useUpdateProfile;