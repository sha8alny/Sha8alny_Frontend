const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const getName = async () => {
  const response = await fetch(`${API_URL}/settings/get-name`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user name");
  return response.json();
};

export const getEmail = async () => {
  const response = await fetch(`${API_URL}/settings/get-email`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user email");
  return response.json();
};

export const deleteAccount = async (password) => {
  const response = await fetch(`${API_URL}/settings/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      Password: password,
    },
  });

  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
};

export const updateEmail = async ({ email, password }) => {
  const response = await fetch(`${API_URL}/settings/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to update email");
  return response.json();
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await fetch(`${API_URL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) throw new Error("Failed to update password");
  return response.json();
};

export const updateUsername = async ({ newUsername }) => {
  const response = await fetch(`${API_URL}/settings/update-username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
};
