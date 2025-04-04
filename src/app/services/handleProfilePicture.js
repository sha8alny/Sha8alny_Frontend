import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Upload a new profile picture
 * @param {File} imageFile - The profile picture file to upload
 * @returns {Promise} - The API response
 */
export const uploadProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  const response = await fetchWithAuth(`${apiURL}/profile/profile-picture`, {
    method: "POST",
    body: formData,
    // Note: Don't set Content-Type header when sending FormData
  });
  
  if (!response.ok) {
    const status = response.status;
    let errorMsg;
    
    switch (status) {
      case 400:
        errorMsg = "Invalid image format or size";
        break;
      case 401:
        errorMsg = "Authentication required to upload profile picture";
        break;
      case 500:
        errorMsg = "Server error occurred during upload";
        break;
      default:
        errorMsg = "Failed to upload profile picture";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};

/**
 * Update an existing profile picture
 * @param {File} imageFile - The profile picture file to update with
 * @returns {Promise} - The API response
 */
export const updateProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  const response = await fetchWithAuth(`${apiURL}/profile/profile-picture`, {
    method: "PUT",
    body: formData,
  });
  
  if (!response.ok) {
    const status = response.status;
    let errorMsg;
    
    switch (status) {
      case 400:
        errorMsg = "Invalid image format or size";
        break;
      case 401:
        errorMsg = "Authentication required to update profile picture";
        break;
      case 404:
        errorMsg = "No profile picture found to update";
        break;
      case 500:
        errorMsg = "Server error occurred during update";
        break;
      default:
        errorMsg = "Failed to update profile picture";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};

/**
 * Delete the current profile picture
 * @returns {Promise} - The API response
 */
export const deleteProfilePicture = async () => {
  const response = await fetchWithAuth(`${apiURL}/profile/profile-picture`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const status = response.status;
    let errorMsg;
    
    switch (status) {
      case 401:
        errorMsg = "Authentication required to delete profile picture";
        break;
      case 404:
        errorMsg = "No profile picture found to delete";
        break;
      case 500:
        errorMsg = "Server error occurred during deletion";
        break;
      default:
        errorMsg = "Failed to delete profile picture";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};