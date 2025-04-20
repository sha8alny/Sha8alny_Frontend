import { fetchWithAuth } from "./userAuthentication";

const apiURL= process.env.NEXT_PUBLIC_API_URL;


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
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};


export const updateEmail = async ({ email, password }) => {
  const response = await fetchWithAuth(`${apiURL}/settings/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
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

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message || data?.error || "Failed to update password";
    throw new Error(message);
  }

  return data;
};

export const updateUsername = async ({ newUsername }) => {
  const response = await fetchWithAuth(`${apiURL}/settings/update-username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: newUsername }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Failed to update username";
    throw new Error(message);
  }

  return data;
};


export const handleSignup = async ({ username,email,password, isAdmin, recaptcha, rememberMe }) => {
  try{
    const signupResponse = await fetch(`${apiURL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password, isAdmin, captcha: recaptcha }),
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
   // const type = isAdmin ? "Admin" : "User";
    const signupResponse = await fetch(`${apiURL}/signup_cross`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password, isAdmin}),
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
    const profileFormData = new FormData();
    profileFormData.append("profilePicture", profilePic);
    const profileResponse = await fetchWithAuth(`${apiURL}/profile/profile-picture`, {
      method: "PUT",
      body: profileFormData,
    });
    if (!profileResponse.ok) throw new Error("Failed to upload profile picture");

    const coverFormData = new FormData();
    coverFormData.append("coverPhoto", coverPic);
    const coverResponse = await fetchWithAuth(`${apiURL}/profile/cover-photo`, {
      method: "PUT",
      body: coverFormData,
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
    return {success:false, message:"Login failed"};
  }catch(error){
    console.error(error);
    return {success:false, message:error.message};
  }

};

export const handleForgetPassword = async (email) => {
  console.log("email",email);
  try {
    const response = await fetch(`${apiURL}/settings/forgot-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( {email} ),
    });
    if (!response.ok) throw new Error("Failed to send reset link");
    console.log("response",response);
    sessionStorage.setItem("resetEmail", email);
    return { success:true};
  }
  catch (error) {
    console.error("Error sending reset link:", error);
    return { success: false, message: error.message };
  }
};

export const handleResetPassword = async (resetCode,newPassword)=>{
  const email = sessionStorage.getItem("resetEmail");
  try{
    const response = await fetch(`${apiURL}/settings/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode, newPassword, email }),
    });
    if (!response.ok) {
      let errorMessage = "An unknown error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || "Unknown error in response";
      } catch (jsonError) {
        const errorText = await response.text();
        errorMessage = errorText || "Unknown error occurred";
      }

      throw new Error(errorMessage);
    }    sessionStorage.removeItem("resetEmail");
    return { success:true};
  }
  catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: error.message };
  }
};

export const handleLogout = async () => {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAdmin");

  window.location.href = "/signin";
}
