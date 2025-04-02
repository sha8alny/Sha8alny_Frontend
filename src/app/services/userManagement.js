import { fetchWithAuth } from "./userAuthentication";


const apiURL= process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const getName = async () => {
  const response = await fetch(`${apiURL}/settings/get-name`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user name");
  return response.json();
};

export const getEmail = async () => {
  const response = await fetch(`${apiURL}/settings/get-email`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user email");
  return response.json();
};

export const deleteAccount = async (password) => {
  const response = await fetch(`${apiURL}/settings/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      Password: password,
    },
  });

  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
};


export const updateEmail = async ({ email, password }) => {
  const response = await fetch(`${apiURL}/settings/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to update email");
  return response.json();
};


export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await fetch(`${apiURL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) throw new Error("Failed to update password");
  return response.json();
};

export const updateUsername = async ({ newUsername }) => {
  const response = await fetch(`${apiURL}/settings/update-username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
};


export const handleSignup = async ({ username,email,password, isAdmin, captcha, rememberMe }) => {
  try{
    const signupResponse = await fetch(`${apiURL}/signup_cross`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password, isAdmin, captcha}),
    });

    if (!signupResponse.ok) throw new Error("Failed to signup");


    const loginResponse = await handleSignIn({email,password, rememberMe});
    if (!loginResponse) throw new Error("Failed to login");
    return {success:true};

  }catch(error){
    throw new Error(error.message);
  }
};

export const completeProfile = async ({formData, profilePic, coverPic})=>{
  try{
    const profileResponse = await fetchWithAuth(`http://localhost:5000/profile/profile-picture`, {
      method: "PUT",
      body: profilePic,
    });
    if (!profileResponse.ok) throw new Error("Failed to upload profile picture");

    const coverResponse = await fetchWithAuth(`http://localhost:5000/profile/cover-photo`, {
      method: "PUT",
      body: coverPic,
    });
    if (!coverResponse.ok) throw new Error("Failed to upload cover photo");

    const data = await fetchWithAuth(`${apiURL}/profile/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!data.ok) throw new Error("Failed to complete profile");

    return true;

  }catch(error){
    throw new Error(error.message);
  }
};


export const handleSignIn = async ({email,password, rememberMe})=>{

  try{
    const loginResponse = await fetch(`${apiURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email,password, rememberMe }),
    });
    if (!loginResponse.ok) throw new Error("Login failed");

    const {accessToken, refreshToken, isAdmin}=await loginResponse.json()
     if (accessToken){
      sessionStorage.setItem("accessToken",accessToken);
     
      if (rememberMe){
      localStorage.setItem("refreshToken",refreshToken);
      }
      localStorage.setItem("isAdmin",isAdmin);
      console.log("accessToken",sessionStorage.getItem("accessToken"));
      return {success:true};
    }
  }catch(error){
    console.error(error);
  }

};


