import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export const fetchBlockedUsers = async (query = "", currentPage, pageSize = 10, companyUsername) => {
  const params = new URLSearchParams();
  params.append('pageNum', currentPage);
  params.append('pageSize', pageSize);
  if (companyUsername) {

      params.append('companyUsername', companyUsername)
  }
  if (query) {
    params.append('text', query);
  }
  
  const response = await fetchWithAuth(`${apiURL}/blocks?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  
  console.log("Fetching blocked users with params:", params.toString());
  
  if (response.status === 204) {
    return { blockedUsers: [], totalCount: 0 };
  }
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to fetch blocked users";
    throw new Error(message);
  }

  return data;
};

export const unblockUser = async (username, isCompany=false, companyUsername) => {
  let url = `${apiURL}/blocks/${username}`;
  if (isCompany) {
    url += `?isCompany=${isCompany}`;
  }
  if(companyUsername){
    url+=`?companyUsername=${companyUsername}`
  }
  console.log("username in unblockuser", username);
  const response = await fetchWithAuth(url, {
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


export const blockUser = async (username, isCompany = false, companyUsername) => {
  let url = `${apiURL}/blocks/${username}`;
  if (isCompany) {
    url += `?isCompany=${isCompany}`;
  }
  if(companyUsername){
    url+=`?companyUsername=${companyUsername}`
  }
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.status;
}