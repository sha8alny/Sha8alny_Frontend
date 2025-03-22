const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const fetchReports = async ({ reportType, pageParam = 1 }) => {
  const itemsPerPage = 5;
  const authToken = getToken();
  const url = new URL(`${API_URL}/admin/reports/page/${reportType}`);
  url.searchParams.append("page", pageParam);
  url.searchParams.append("limit", itemsPerPage);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return {
    data,
    nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
    prevPage: pageParam > 1 ? pageParam - 1 : null,
  };
};

export const deleteReport = async (reportId) => {
  const authToken = getToken();

  const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteJob = async (jobId) => {
  const authToken = getToken();

  const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const updateStatusReport = async (reportId, status) => {
  const authToken = getToken();

  const response = await fetch(`${API_URL}/admin/reports/`, {
    method: "PUT", 
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({reportId ,status }),
  });
}
