import { fetchWithAuth } from "./userAuthentication";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSidebarInfo = async () => {
  const response = await fetchWithAuth(`${apiURL}/home`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const status = response.status;
    let errorMsg;

    switch (status) {
      case 401:
        errorMsg = "Authentication required to access this resource";
        break;
      case 404:
        errorMsg = "Resource not found";
        break;
    }

    // Create an error object with both message and status properties
    const error = new Error(errorMsg);
    error.response = { status: status };
    throw error;
  }
  return response.json();
};
