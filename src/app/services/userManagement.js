import { fetchWithAuth } from "./userAuthentication";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

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

export const checkEmail = async ({ email, password }) => {
  const response = await fetchWithAuth(`${apiURL}/settings/check-email`, {
    method: "POST",
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
    const message = data?.message || data?.error || "Failed to update password";
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

export const checkSignupData = async ({ username, email, password }) => {
  try {
    const response = await fetch(`${apiURL}/check-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.status === 400) {
      return { success: false, message: data.error };
    }
    if (!response.ok) {
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }

    return { success: true, message: "Data is valid" };
  } catch (error) {
    console.error("Error checking signup data:", error);
    return { success: false, message: "Something went wrong! Try Again Later" };
  }
};

export const sendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${apiURL}/send-verification-email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to send verification email");
    const data = await response.json();
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

export const verifyEmail = async (email, verificationCode) => {
  try {
    const queryParams = new URLSearchParams({ email, code: verificationCode });
    const response = await fetch(
      `${apiURL}/verify-email?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to verify email");
    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
};

export const checkVerifiedEmail = async (email) => {
  try {
    const response = await fetch(`${apiURL}/check-verified-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to check verified email");
    const data = await response.json();
    if (data.status === 400) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking verified email:", error);
  }
};

export const handleSignup = async ({
  username,
  email,
  password,
  isAdmin,
  recaptcha,
  rememberMe,
}) => {
  try {
    const signupResponse = await fetch(`${apiURL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        isAdmin,
        captcha: recaptcha,
      }),
    });

    if (!signupResponse.ok) throw new Error("Failed to signup");

    const loginResponse = await handleSignIn({ email, password, rememberMe });

    if (!loginResponse) throw new Error("Failed to login");
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const handleSignupCross = async ({
  username,
  email,
  password,
  isAdmin,
  recaptcha,
  rememberMe,
}) => {
  try {
    // const type = isAdmin ? "Admin" : "User";
    const signupResponse = await fetch(`${apiURL}/signup_cross`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, isAdmin }),
    });

    if (!signupResponse.ok) throw new Error("Failed to signup");

    const loginResponse = await handleSignIn({ email, password, rememberMe });
    if (!loginResponse) throw new Error("Failed to login");
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const completeProfile = async ({ formData, profilePic, coverPic }) => {
  try {
    if (profilePic) {
      const profileFormData = new FormData();
      profileFormData.append("profilePicture", profilePic);
      console.log("profileFormData", profileFormData);
      const profileResponse = await fetchWithAuth(
        `${apiURL}/profile/profile-picture`,
        {
          method: "PUT",
          body: profileFormData,
        }
      );
      if (!profileResponse.ok)
        throw new Error("Failed to upload profile picture");
    }
    if (coverPic) {
      const coverFormData = new FormData();
      coverFormData.append("coverPhoto", coverPic);
      console.log("coverFormData", coverFormData);
      const coverResponse = await fetchWithAuth(
        `${apiURL}/profile/cover-photo`,
        {
          method: "PUT",
          body: coverFormData,
        }
      );
      if (!coverResponse.ok) throw new Error("Failed to upload cover photo");
    }

    const data = await fetchWithAuth(`${apiURL}/profile/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!data.ok) throw new Error("Failed to complete profile");
    const isCompleteProfile = await fetchWithAuth(
      `${apiURL}/complete-profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!isCompleteProfile.ok) throw new Error("Failed to complete profile");
    localStorage.setItem("isProfileComplete", true);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const handleSignIn = async ({ email, password, rememberMe }) => {
  try {
    const loginResponse = await fetch(`${apiURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    if (!loginResponse.ok) throw new Error("Login failed");

    const { accessToken, refreshToken, isAdmin, isComplete } =
      await loginResponse.json();
    if (accessToken) {
      const now = Date.now();
      // Store access token with 1-day expiry
      sessionStorage.setItem("accessToken", JSON.stringify({
        value: accessToken,
        expiry: now + 24 * 60 * 60 * 1000, // 1 day
      }));

      if (rememberMe) {
        // Store refresh token with 30-day expiry
        localStorage.setItem("refreshToken", JSON.stringify({
          value: refreshToken,
          expiry: now + 7 * 24 * 60 * 60 * 1000, // 30 days
        }));
      }
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("isProfileComplete", isComplete);
      return { success: true };
    }
    return { success: false, message: "Login failed" };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const handleForgetPassword = async (email) => {
  console.log("email", email);
  try {
    const response = await fetch(`${apiURL}/settings/forgot-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to send reset link");
    console.log("response", response);
    sessionStorage.setItem("resetEmail", email);
    return { success: true };
  } catch (error) {
    console.error("Error sending reset link:", error);
    return { success: false, message: error.message };
  }
};

export const handleResetPassword = async (resetCode, newPassword) => {
  const email = sessionStorage.getItem("resetEmail");
  try {
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
    }
    sessionStorage.removeItem("resetEmail");
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: error.message };
  }
};

export const handleGoogleSignIn = async (token) => {
  try {
    const response = await fetch(`${apiURL}/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: token }),
    });

    if (!response.ok) throw new Error("Login failed");

    const { accessToken, refreshToken, isComplete, isAdmin } = await response.json();
    const now = Date.now();
    if (accessToken) {
      // Store access token with 1-day expiry
      sessionStorage.setItem("accessToken", JSON.stringify({
        value: accessToken,
        expiry: now + 24 * 60 * 60 * 1000, // 1 day
      }));
      // Store refresh token with 30-day expiry
      localStorage.setItem("refreshToken", JSON.stringify({
        value: refreshToken,
        expiry: now + 7 * 24 * 60 * 60 * 1000, // 7 days
      }));
      localStorage.setItem("isProfileComplete", isComplete);
      localStorage.setItem("isAdmin", isAdmin);
      return { success: true };
    }
    return { success: false, message: "Login failed" };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const handleLogout = async () => {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("isProfileComplete");

  window.location.href = "/signin";
};

export const checkHasPassword = async () => {
  try {
    const response = await fetchWithAuth(`${apiURL}/has-password`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to check password");
    const data = await response.json();
    return data.hasPassword;
  } catch (error) {
    console.error("Error checking password:", error);
    return false;
  }
};
