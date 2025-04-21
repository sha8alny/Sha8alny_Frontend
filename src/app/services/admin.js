const apiURL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "@/app/services/userAuthentication";

export const fetchReports = async ({
  pageParam = 1,
  users = false,
  jobs = false,
  comments = false,
  posts = false,
  sortByTime,
  statuses = [],
  TypeFilter = [],
}) => {
  const itemsPerPage = 10;
  const url = new URL(`http://localhost:5000/admin/reports/${pageParam}`);

  url.searchParams.append("users", users.toString());
  url.searchParams.append("jobs", jobs.toString());
  url.searchParams.append("comments", comments.toString());
  url.searchParams.append("posts", posts.toString());

  statuses.forEach((status) => url.searchParams.append("statuses", status));
  console.log(sortByTime);
  if (sortByTime) {
    url.searchParams.append("sortByTime", sortByTime);
  }
  if (TypeFilter.length > 0) {
    TypeFilter.forEach((type) => url.searchParams.append("TypeFilter", type));
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
    nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
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
};

export const deleteJob = async (jobId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/jobs/${jobId}`, {
    method: "DELETE",
  });
};
export const deleteComment = async (commentId) => {
  const response = await fetchWithAuth(
    `${apiURL}/admin/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
};
export const deletePost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/posts/${postId}`, {
    method: "DELETE",
  });
};
export const deleteUser = async (userId) => {
  const response = await fetchWithAuth(`${apiURL}/admin/users/${userId}`, {
    method: "DELETE",
  });
};

export const updateStatusReport = async (reportId, status) => {
  const response = await fetchWithAuth(`${apiURL}/admin/reports/`, {
    method: "PATCH",

    body: JSON.stringify({ reportId, status }),
  });
};
