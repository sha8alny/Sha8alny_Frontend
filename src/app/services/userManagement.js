

const apiURL= process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./userAuthentication";


export const getName = async () => {
  const response = await fetchWithAuth(`${apiURL}/settings/get-name`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetchWithAuth user name");
  return response.json();
};

export const getEmail = async () => {
  const response = await fetchWithAuth(`${apiURL}/settings/get-email`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
 
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user email");
  return response.json();
};

export const deleteAccount = async (password) => {
  const response = await fetchWithAuth(`${apiURL}/settings/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
};


export const updateEmail = async ({ email, password }) => {
  const response = await fetchWithAuth(`${apiURL}/settings/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to update email");
  return response.json();
};


export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await fetchWithAuth(`${apiURL}/settings/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetchWithAuth(`${apiURL}/settings/update-username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
};


export const handleSignup = async ({ username,email,password, isAdmin, recaptcha, rememberMe }) => {
  try{
    const type = isAdmin ? "Admin" : "User";
    const signupResponse = await fetch(`${apiURL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password, type, recaptcha}),
    });

    if (!signupResponse.ok) throw new Error("Failed to signup");


    const loginResponse = await handleSignIn({email,password, rememberMe});
    if (!loginResponse) throw new Error("Failed to login");
    return {success:true};

  }catch(error){
    throw new Error(error.message);
  }
};

export const handleSignupCross = async ({ username,email,password, isAdmin, recaptcha, rememberMe }) => {
  try{
    const type = isAdmin ? "Admin" : "User";
    const signupResponse = await fetch(`${apiURL}/signup_cross`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password, type}),
    });

    if (!signupResponse.ok) throw new Error("Failed to signup");


    const loginResponse = await handleSignIn({email,password, rememberMe});
    if (!loginResponse) throw new Error("Failed to login");
    return {success:true};

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


