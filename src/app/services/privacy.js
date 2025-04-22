const apiURL = process.env.NEXT_PUBLIC_API_URL;
export const fetchBlockedUsers = async (query = "", pageSize = 1) => {
  const response = await fetch(`http://localhost:5000/blocked?name=${query}&pageSize=${pageSize}`);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};

export const unblockUser = async (userId) => {
  const response = await fetch(`http://localhost:5000/blocked/${userId}`, {
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};
