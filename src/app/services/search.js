const apiURL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./userAuthentication";

export const searchCompany = async (
  keyword,
  currentPage = 1,
  industry = "",
  location = "",
  size = "",
  type = "",

  pageSize = 10
) => {
  console.log("asdsa");
  console.log({
    keyword,
    currentPage,
    industry,
    location,
    size,
    type,
    pageSize,
  });
  const response = await fetchWithAuth(
    `${apiURL}/search/company?text=${encodeURIComponent(keyword)}
    &pageNum=${currentPage}
    &pageSize=${pageSize}
    &industry=${encodeURIComponent(industry || "")}
    &location=${encodeURIComponent(location || "")}
    &orgSize=${encodeURIComponent(size || "")}
    &orgType=${encodeURIComponent(type || "")}`.replace(/\s+/g, ""),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = null;
  }
  if (!response.ok) {
    const message =
      data?.message || data?.error || "Failed to search companies";
    throw new Error(message);
  }

  return data;
};

export const searchUser = async (
  name,
  industry,
  company,
  location,
  connectionDegree,
  pageNum = 1,
  pageSize = 10
) => {
  const response = await fetchWithAuth(
    `${apiURL}/users/search/${pageNum}/${pageSize}?name=${encodeURIComponent(
      name
    )}&industry=${encodeURIComponent(
      industry || ""
    )}&company=${encodeURIComponent(
      company || ""
    )}&location=${encodeURIComponent(
      location || ""
    )}&connectionDegree=${encodeURIComponent(connectionDegree || "")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = null;
  }
  if(response.status === 204) {
    return [];
  }
  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to search users";
    throw new Error(message);
  }

  return data.users;
};

export const fetchJobListings = async (text, pageNum) => {
  const response = await fetchWithAuth(
    `${apiURL}/jobs/search/${pageNum}/${3}?keyword=${encodeURIComponent(text)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message || data?.error || "Failed to fetch job listings";
    throw new Error(message);
  }

  return data;
};

export const searchPosts = async (keyword = "", pageNum) => {
  const transformKeyword = (text) => {
    return text.trim().replace(/\s+/g, "$").replace(/,+/g, "%");
  };

  const formattedKeyword = transformKeyword(keyword);

  const response = await fetchWithAuth(
    `${apiURL}/search/posts?keyword=${formattedKeyword}&pageNum=${pageNum}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to fetch posts";
    throw new Error(message);
  }

  return data;
};
