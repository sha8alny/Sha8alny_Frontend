import { fetchWithAuth } from "./userAuthentication";

export const connectUser = async (username) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/connection`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetId: username }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to connect user");
  }
  return response.status;
};