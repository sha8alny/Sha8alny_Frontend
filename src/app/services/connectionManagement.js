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

export const deleteConnection = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUsername: username }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete connection");
  }
  return response.status;
};

export const requestConnection = async (username, status) => {
  const response = await fetchWithAuth(`${apiURL}/connection/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }), 
  });

  if (!response.ok) {
    throw new Error("Failed to update connection status");
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

export const getFollowers = async(page =1, pageSize =10 , username) => {
  console.log("username in djh ", username);
  const response = await fetchWithAuth (`${apiURL}/followers/${page}/${pageSize}?username=${encodeURIComponent(username)}`,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get followers");
  }
  return response.json();
};