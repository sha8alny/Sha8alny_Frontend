const apiURL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const fetchReports = async ({
  pageParam = 1,
  users = false,
  jobs = false,
  comments = false,
  posts = false,
  sortByTime ,
  statuses = [],
  TypeFilter = [],
}) => {
  const authToken = getToken();
  const itemsPerPage = 10;
  const url = new URL(`http://localhost:5000/admin/reports/${pageParam}`);

  url.searchParams.append("users", users.toString());
  url.searchParams.append("jobs", jobs.toString());
  url.searchParams.append("comments", comments.toString());
  url.searchParams.append("posts", posts.toString());

  statuses.forEach((status) => url.searchParams.append("statuses", status));
  console.log(sortByTime)
  if (sortByTime) {
    url.searchParams.append("sortByTime", sortByTime);
  }
  if (TypeFilter.length > 0) {
    TypeFilter.forEach((type) => url.searchParams.append("TypeFilter", type));
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("data", data);
  return {
    data,
    nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
    prevPage: pageParam > 1 ? pageParam - 1 : null,
  };
};

export const deleteReport = async (reportId) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteJob = async (jobId) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
export const deleteComment = async (commentId) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
export const deletePost = async (postId) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
export const deleteUser = async (userId) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const updateStatusReport = async (reportId, status) => {
  const authToken = getToken();

  const response = await fetch(`${apiURL}/admin/reports/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reportId, status }),
  });
};
