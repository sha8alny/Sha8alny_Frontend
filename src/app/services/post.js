
import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export const getMyPosts = async (pageNum, companyId)=>{
    try{
        const response = await fetchWithAuth (`${apiURL}/myPosts?pageNum=${pageNum}&companyId=${companyId}`,{
            method: "GET",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to update post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const updateMyPosts = async (postId,postData ) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/myPosts/${postId}`,{
            method:"PATCH",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(postData)
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to update post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const deleteMyPosts = async (postId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/myPosts/${postId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer${sessionStorage.getItem("accessToken")}` },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get saved posts: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const getDeletedPosts = async(pageNum)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/myPosts/restore`,{
            method:"GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get deleted posts: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const restoreDeletedPosts = async (postId)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/myPosts/restore/${postId}`,{
            method:"POST",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to restore deleted posts: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const getPost= async(pageNum,query = "")=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/posts?query=${query}`,{
            method:"GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const createPost= async(postData, companyId)=>{
    try{
        console.log("📦 postData being sent:", postData);
        console.log("📦 companyId being sent:", companyId);
        const response= await fetchWithAuth(`${apiURL}/posts?companyId=${companyId}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(postData),
        });

        if (!response) {
            throw new Error("No response received from server.");
        }
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to create post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const getSpecificPost= async(postId)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}`,{
            method:"GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
}

export const getSavedPosts = async(pageNum = 1) => {
    try {
        const response = await fetchWithAuth(`${apiURL}/save/posts?pageNum=${pageNum}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });
    
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get saved posts: ${response.status} ${responseText}`);
        }
        
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    } catch(error) {
        throw new Error(error.message);
    }
};

export const savePost = async(postId)=>{
    try{
        const response = await fetchWithAuth (`${apiURL}/posts/${postId}/save`,{
            method:"POST",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to save post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const unsavePost = async(postId)=>{
    try{
        const response = await fetchWithAuth (`${apiURL}/posts/${postId}/save`,{
            method:"DELETE",
            headers: {"Authorization": `Bearer${sessionStorage.getItem("accessToken")}`}
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to unsave post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
}

export const getShares = async(postId) =>{
    try{
        const response = await fetchWithAuth (`${apiURL}/posts/${postId}/share`,{
            method:"GET",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}` 
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get share: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
}

export const sharePost = async(postId)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/share`,{
            method:"POST",
            headers: {"Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}` 
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to share post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
}

export const unsharePost = async(postId)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/share`,{
            method:"DELETE",
            headers: {"Authorization": `Bearer${sessionStorage.getItem("accessToken")}`}
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to unshare post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
}


export const unlikePost = async (postId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/react`, {
            method: "DELETE",
            headers :{"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`}
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to unlike post: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const getLikes = async (postId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/react`, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
             },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to fetch likes: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }

    }catch(error){
        throw new Error(error.message);
    }
};

export const getComments = async (postId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/comment`, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer${sessionStorage.getItem("accessToken")}`
             },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to fetch comments: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const addComment = async (postId, text) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ text }),
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to add comment: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const updateComment = async(postId, commentId, text)=>{
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/comment`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ text }),
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 
    
        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to add comment: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
}

export const deleteComment = async (postId, commentId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/comment`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`, 
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to delete comment: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const likeComment = async (postId, commentId) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/${postId}/react`, {
            method: "POST",
            headers:{"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`}
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to like comment/post/reply: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const searchPosts = async (keyword) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/posts/search/${keyword}`, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
             },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get search posts: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const getTags = async (text) => {
    try {
        const response = await fetchWithAuth(`${apiURL}/tags?text=${encodeURIComponent(text)}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to fetch tags: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

