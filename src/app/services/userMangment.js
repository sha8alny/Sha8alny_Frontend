export const fetchUser = async () => {    
  const response = await fetch("http://localhost:5000/user");
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

export const deleteAccount = async (password) => {
  const response = await fetch("http://localhost:5000/settings/delete-account", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
};

export const updateEmail = async ({ new_email, password }) => {
  const response = await fetch("http://localhost:5000/settings/update-email", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to update email");
  }
  return response.json();
};

export const updatePassword = async ({ currentPassword, newPassword }) => {
  const response = await fetch("http://localhost:5000/settings/update-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_password:currentPassword, new_password: newPassword }),
  });
  if (!response.ok) throw new Error("Failed to update password");
  return response.json();
};

export const updateUsername = async ({ newUsername }) => {
  const response = await fetch("http://localhost:5000/settings/update-username", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
};

