import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfile = async (username) => {
  const response = await fetchWithAuth(`${apiURL}/profile/user/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const status = response.status;
    let errorMsg;

    switch (status) {
      case 404:
        errorMsg = "User profile not found";
        break;
      case 403:
        errorMsg = "You don't have permission to view this profile";
        break;
      case 401:
        errorMsg = "Authentication required to access this profile";
        break;
      case 500:
        errorMsg = "Server error occurred";
        break;
      default:
        errorMsg = "Failed to fetch user profile";
    }

    const error = new Error(errorMsg);
    error.response = { status: status };
    throw error;
  }
  return response.json();
};

export const fetchUsername = async () => {
  const response = await fetchWithAuth(`${apiURL}/profile/username`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user username");
  return response.json();
};

export const fetchUserConnections = async (
  pageNum = 1,
  pageSize = 10,
  username = null
) => {
  let url = `${apiURL}/connections/${pageNum}/${pageSize}`;
  if (username) {
    url += `?username=${username}`;
  }
  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user connections");
  return response.json();
};

export const fetchPeopleAlsoViewed = async (username) => {
  const response = await fetchWithAuth(
    `${apiURL}/profile/people-also-viewed/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch people also viewed");
  const data = await response.json();
  return data.peopleAlsoViewed;
};
