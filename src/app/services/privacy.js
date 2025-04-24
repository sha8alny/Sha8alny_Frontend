import { fetchWithAuth } from "./userAuthentication";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBlockedUsers = async (query = "", pageSize = 1) => {
  const response = await fetch(
    `http://localhost:5000/blocked?name=${query}&pageSize=${pageSize}`
  );
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

export const report = async (
  postId,
  commentId,
  username,
  jobId,
  isCompany,
  report
) => {
  let url = `${apiURL}/reports`;
  
  // Build URL with proper query parameters
  if (postId !== undefined && postId !== null) {
    url += `?postId=${postId}`;
  } else if (commentId !== undefined && commentId !== null) {
    url += `?commentId=${commentId}`;
  } else if (username) {
    url += `?username=${username}`;
  } else if (jobId !== undefined && jobId !== null) {
    url += `?jobId=${jobId}`;
  } else {
    throw new Error("Invalid report type");
  }
  
  if (isCompany) {
    // Use & or ? depending on whether we already have query parameters
    url += (url.includes('?') ? '&' : '?') + `isCompanyString=${isCompany}`;
  }
  
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });
  
  if (!response.ok) {
    throw new Error("Failed to report post");
  }
  return await response.json();
};
