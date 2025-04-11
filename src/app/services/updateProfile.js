import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Update profile data or upload media files
 * @param {string} api - API endpoint suffix
 * @param {Object|FormData} data - Data to send (object for JSON or FormData for files)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {boolean} isFormData - Flag to indicate if data is FormData
 * @returns {Promise} - API response
 */
export const updateProfile = async (api, data, method = "PATCH", isFormData = false) => {
  const options = {
    method,
    headers: !isFormData ? { "Content-Type": "application/json" } : {},
    body: isFormData ? data : JSON.stringify(data),
  };

  if (method === "GET" || (method === "DELETE" && !data)) {
    delete options.body;
  }

  const response = await fetchWithAuth(`${apiURL}/${api}`, options);

  if (!response.ok) {
    const error = new Error(`Failed to ${method.toLowerCase()} ${api}`);
    error.status = response.status;
    throw error;
  }

  if (method === "DELETE" || response.headers.get("content-length") === "0") {
    return { success: true };
  }

  try {
    return await response.json();
  } catch (e) {
    // If there's no JSON response but the request was successful
    return { success: true };
  }
};
