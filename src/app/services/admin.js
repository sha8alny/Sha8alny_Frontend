const apiURL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "@/app/services/userAuthentication";





export const fetchDashboardData = async () => {
  try {
    const response = await fetchWithAuth(`${apiURL}/admin/analytics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching analytics data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};




export const fetchReports = async ({
  pageParam = 1,
  pageSize = 10,
  type = [],
  reason = [],
  status = [],
  sortByTime,
}) => {
  const url = new URL(`${apiURL}/admin/reports/`);

  url.searchParams.append("page", pageParam.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  if (type.length > 0) {
    url.searchParams.append("type", type.join(','));
  }

  if (reason.length > 0) {
    url.searchParams.append("reason", reason.join(','));
  }

  if (status.length > 0) {
    url.searchParams.append("status", status.join(','));
  }

  if (sortByTime) {
    url.searchParams.append("sortByTime", sortByTime);
  }

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    nextPage: data.length === pageSize ? pageParam + 1 : null,
    prevPage: pageParam > 1 ? pageParam - 1 : null,
  };
};

export const deleteReport = async (reportId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};

export const deleteJob = async (jobId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/jobs/${jobId}`, {
    method: "DELETE",
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetchWithAuth(
    `${apiURL}/admin/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};

export const deletePost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/posts/${postId}`, {
    method: "DELETE",
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/users/${userId}`, {
    method: "DELETE",
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};

export const updateStatusReport = async ({ reportId, status }) => {
  const response = await fetchWithAuth(`${apiURL}/admin/reports/${reportId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }
  
  return response.status === 204 ? {} : await response.json();
};
