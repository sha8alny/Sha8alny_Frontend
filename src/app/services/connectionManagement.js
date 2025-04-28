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

export const followUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    throw new Error("Failed to follow user");
  }
  return response.status;
};

export const unFollowUser = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/follow/${username}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to follow user");
  }
  return response.status;
};

export const getConnections = async (page) => {
  const pageSize = 9;

  try {
    const response = await fetchWithAuth(`${apiURL}/connections/${page}/${pageSize}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch connections: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.warn("Expected an array from backend, got:", data);
        return [];
      }

      return data;
    } else {
      console.warn("Response was not JSON");
      return [];
    }
  } catch (error) {
    console.error("Error fetching connections:", error);
    return [];
  }
};


export const getFollowers = async (page) => {
  const pageSize = 9;
  const response = await fetchWithAuth(`${apiURL}/followers/${page}/${pageSize}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch followers");
  }
  if(response.status === 204) {
    return [];
  }
  const data = await response.json();
  return data;
}

export const getFollowing = async (page) => {
  const pageSize = 9;
  const response = await fetchWithAuth(`${apiURL}/following/users/${page}/${pageSize}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch following");
  }
  if(response.status === 204) {
    return [];
  }
  const data = await response.json();
  return data;
}

export const getConnectionRequests = async (page) => {
  const pageSize = 9;
  const response = await fetchWithAuth(`${apiURL}/connections/pending/received/${page}/${pageSize}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch connection requests");
  }
  if(response.status === 204) {
    return [];
  }
  const data = await response.json();
  return data;
}

export const getSentConnectionRequests = async (page) => {
  const pageSize = 9;
  const response = await fetchWithAuth(`${apiURL}/connections/pending/sent/${page}/${pageSize}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch sent connection requests");
  }
  if(response.status === 204) {
    return [];
  }
  const data = await response.json();
  return data;
}

export const manageConnectionRequest = async ({username, status}) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to accept connection request");
  }
  return true;
}

export const removeConnection = async ({username}) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to cancel connection request");
  }
  return true;
}
