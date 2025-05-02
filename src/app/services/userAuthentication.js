import { resetSessionTime, getSessionTime } from "../utils/sessionTime";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = getValidAccessToken();
  const refreshToken = getValidRefreshToken();
  if (!accessToken && !refreshToken) {
    redirectToSignIn();
    return;
  }
  const headers = {
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
  
  // session time logic
  try {
    const urlObj = new URL(url, window.location.origin);
    const pageNum = urlObj.searchParams.get("pageNum");
    
   
    let sessionTime;
    if (pageNum === "1" || !getSessionTime()) {
      sessionTime = await resetSessionTime();
    } else {
      sessionTime = getSessionTime();
    }
    
    if (sessionTime) {
      urlObj.searchParams.set("sessionTime", sessionTime);
      url = urlObj.toString();
    }
    
  } catch (err) {
    console.error("Invalid URL passed to fetchWithAuth:", url);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      redirectToSignIn();
      return;
    }
    headers.Authorization = `Bearer ${newAccessToken}`;
    response = await fetch(url, { ...options, headers });
  }
  return response;
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = getValidRefreshToken();
    const now = Date.now();
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await fetch(`${apiURL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error("Failed to refresh access token");
    const { accessToken } = await response.json();
    sessionStorage.setItem("accessToken", JSON.stringify({
      value: accessToken,
      expiry: now + 24 * 60 * 60 * 1000, // 1 day
    }));
    return accessToken;
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return null;
  }
};

export const getValidAccessToken = () => {
  const tokenStr = sessionStorage.getItem("accessToken");
  if (!tokenStr) return null;

  try {
    const { value, expiry } = JSON.parse(tokenStr);
    if (Date.now() > expiry) {
      sessionStorage.removeItem("accessToken");
      return null;
    }
    return value;
  } catch {
    sessionStorage.removeItem("accessToken");
    return null;
  }
};

export const getValidRefreshToken = () => {
  const tokenStr = localStorage.getItem("refreshToken");
  if (!tokenStr) return null;

  try {
    const { value, expiry } = JSON.parse(tokenStr);
    if (Date.now() > expiry) {
      localStorage.removeItem("refreshToken");
      return null;
    }
    return value;
  } catch {
    localStorage.removeItem("refreshToken");
    return null;
  }
};


export const redirectToSignIn = () => {
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  window.location.href = "/signin";
};

export const checkAdminStatus = async () => {
  try {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetchWithAuth(`${apiURL}/check-admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return false;
    }

    if (!response.ok) {
      console.error("Failed to check admin status, status:", response.status);
      return false;
    }

    try {
      const data = await response.json();
      return data.isAdmin === true;
    } catch (parseError) {
      console.error("Error parsing admin status response:", parseError);
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
