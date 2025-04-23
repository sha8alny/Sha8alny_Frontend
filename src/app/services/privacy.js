const apiURL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./userAuthentication";
export const fetchBlockedUsers = async (query = "", currentPage,pageSize = 1) => {
  const response = await fetchWithAuth(`${apiURL}/blocks?name=${query}&pageSize=${pageSize}&pageNum=${currentPage}`,{
    method: "GET",
  });
  
  if (response.status === 204) {
    return { blockedUsers: [], totalCount: 0 };
  }
  
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};

export const unblockUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/blocks/${username}`, {
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};
