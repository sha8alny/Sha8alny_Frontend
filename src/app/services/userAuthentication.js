
const apiURL= process.env.NEXT_PUBLIC_API_URL;


export const fetchWithAuth = async (url, options={}) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
        redirectToSignIn();
        return;
    }
    const headers = {
        ...options.headers,
        ...(accessToken &&
       { Authorization: `Bearer ${accessToken}`,}),
    };

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
    try{
      const refreshToken = localStorage.getItem("refreshToken");
      if(!refreshToken) throw new Error("No refresh token found");
  
      const response = await fetch(`${apiURL}/refresh-token`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({refreshToken}),
      });
      if (!response.ok) throw new Error("Failed to refresh access token");
      const {accessToken}=await response.json();
      sessionStorage.setItem("accessToken",accessToken);
      return accessToken;
    }catch(error){
      console.error("Token refresh error:", error.message);
      return null;
  
    }
  };

export const redirectToSignIn = () => {
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    window.location.href = "/signin";
}