import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const connectUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/connection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUsername: username }),
  });
  if (!response.ok) {
    throw new Error("Failed to connect user");
  }
  return response.status;
};

export const removeConnection = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to remove connection");
  }
  return response.status;
};

export const followUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  });
  if (!response.ok) {
    throw new Error("Failed to follow user");
  }
  return response.status;
};

export const unfollowUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/unfollow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  });
  if (!response.ok) {
    throw new Error("Failed to unfollow user");
  }
  return response.status;
};

export const handleConnectionRequest = async (username, action) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: action === "ACCEPT" ? "accepted" : "declined" }),
  });
  if (!response.ok) {
    throw new Error("Failed to handle connection");
  }
  return response.status;
};


export const fetchPeopleYouMayKnow = async () => {
  const response = await fetchWithAuth(`${apiURL}/connections/suggestions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch people you may know");
  }
  return response.json();
}