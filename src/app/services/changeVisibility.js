import { fetchWithAuth } from "./userAuthentication";

export const changeVisibility = async (visibility) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/update-visibility`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visibility }),
    }
  );

  if (!response.ok) throw new Error("Failed to change visibility");
  
  switch (response.status) {
    case 200:
      return response.json();
    case 401:
      throw new Error("Authentication required to change visibility");
    case 403:
      throw new Error("You do not have permission to change visibility");
    case 404:
      throw new Error("User not found");
    default:
      throw new Error("An unknown error occurred while changing visibility");
  }
};
