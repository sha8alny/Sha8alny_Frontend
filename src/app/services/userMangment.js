export const fetchUser = async () => {    
  const response = await fetch("http://localhost:3000/user");
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

export const deleteAccount = async (password) => {
  const response = await fetch("http://localhost:3000/settings/delete-account", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
};

export const updateEmail = async ({ new_email, password }) => {
  const response = await fetch("http://localhost:3000/settings/update-email", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to update email");
  }
  return response.json();
};

export const updatePassword = async ({ currentPassword, newPassword }) => {
  const response = await fetch("http://localhost:3000/settings/update-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_password:currentPassword, new_password: newPassword }),
  });
  if (!response.ok) throw new Error("Failed to update password");
  return response.json();
};

export const updateUsername = async ({ newUsername }) => {
  const response = await fetch("http://localhost:3000/settings/update-username", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsername }),
  });

  if (!response.ok) throw new Error("Failed to update username");
  return response.json();
};

export const handleSignup = async ({ username,email,password, isAdmin, captcha, rememberMe }) => {
  try{
    const signupResponse = await fetch("http://localhost:3000/signup", {
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

export const handleSignIn = async ({email,password, rememberMe})=>{

  try{
    const loginResponse = await fetch("http://localhost:3000/login", {
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

