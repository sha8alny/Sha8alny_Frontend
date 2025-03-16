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

export const handleSignup = async ({ username,email,password }) => {
  try{
    const signupResponse = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(username,email,password),
    });
    const responseData=await signupResponse.json();
    if(signupResponse.ok){
      alert(responseData.message);
      localStorage.setItem("token",responseData.token);
      return {success:true}
    }
    if (!signupResponse.ok) throw new Error(responseData.message ||"Failed to signup");

    const loginResponse = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email,password }),
    });
    if (!loginResponse.ok) throw new Error("Login failed");

    const {token}=await loginResponse.json()
    if (token){
      localStorage.setItem("token",token);
      return {success:true};
    }
    throw new Error ("Token missing in response")
  }catch(error){
    throw new Error(error.message);
  }
};

export const handleSignIn = async ({email,password})=>{
  try{
    const loginResponse = await fetch("http://localhost:3000/login",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email,password }),
    });
    if (!loginResponse.ok) throw new Error("Login failed");

    const {token}=await loginResponse.json()
    if (token){
      localStorage.setItem("token",token);
      return {success:true};
    }
  }catch(error){
    console.error(error);
  }

};