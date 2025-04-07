import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Upload a new cover photo
 * @param {File} imageFile - The cover photo file to upload
 * @returns {Promise} - The API response
 */
export const uploadCoverPhoto = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  const response = await fetchWithAuth(`${apiURL}/profile/cover-photo`, {
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
        errorMsg = "Authentication required to upload cover photo";
        break;
      case 500:
        errorMsg = "Server error occurred during upload";
        break;
      default:
        errorMsg = "Failed to upload cover photo";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};

/**
 * Update an existing cover photo
 * @param {File} imageFile - The cover photo file to update with
 * @returns {Promise} - The API response
 */
export const updateCoverPhoto = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  const response = await fetchWithAuth(`${apiURL}/profile/cover-photo`, {
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
        errorMsg = "Authentication required to update cover photo";
        break;
      case 404:
        errorMsg = "No cover photo found to update";
        break;
      case 500:
        errorMsg = "Server error occurred during update";
        break;
      default:
        errorMsg = "Failed to update cover photo";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};

/**
 * Delete the current cover photo
 * @returns {Promise} - The API response
 */
export const deleteCoverPhoto = async () => {
  const response = await fetchWithAuth(`${apiURL}/profile/cover-photo`, {
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
        errorMsg = "Authentication required to delete cover photo";
        break;
      case 404:
        errorMsg = "No cover photo found to delete";
        break;
      case 500:
        errorMsg = "Server error occurred during deletion";
        break;
      default:
        errorMsg = "Failed to delete cover photo";
    }
    
    const error = new Error(errorMsg);
    error.response = { status };
    throw error;
  }
  
  return response.json();
};