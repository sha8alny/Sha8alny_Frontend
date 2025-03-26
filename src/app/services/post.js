const apiURL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
    const token = localStorage.getItem("token") || "mock-token";
    // if (!token) throw new Error("No token found");
    return token;
};

export const getPosts = async (query = "") => {
    const response = await fetch(`${apiURL}/posts?query=${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch posts");
    return await response.json();
};

export const createPost = async(postData)=>{
    console.log("postData",postData);
    const response= await fetch(`${apiURL}/posts`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return await response.json();
};

export const getPost = async (postId)=>{
    const response = await fetch (`${apiURL}/posts/${postId}`,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch post");
    return await response.json();
};

export const savePost = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/save`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to save post");
    return "Post saved successfully";
};

export const updatePost = async (postId, postData) => {
    const response = await fetch(`${apiURL}/posts/${postId}/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to update post");
    return await response.json();
};

export const deletePost = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/edit`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return "Post deleted successfully";
};

export const likePost = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Failed to like post");
    return "Post liked successfully";
};

export const unlikePost = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/like`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to unlike post");
    return "Post unliked successfully";
};

export const getLikes = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/like`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch likes");
    return await response.json();
};

export const getComments = async (postId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch comments");
    return await response.json();
};

export const addComment = async (postId, text) => {
    const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return "Comment added successfully";
};

export const deleteComment = async (postId, commentId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to delete comment");
    return "Comment deleted successfully";
};

export const likeComment = async (postId, commentId) => {
    const response = await fetch(`${apiURL}/posts/${postId}/comment/${commentId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Failed to like comment");
    return "Comment liked successfully";
};

export const searchPosts = async (keyword) => {
    const response = await fetch(`${apiURL}/posts/search/${keyword}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to search posts");
    return await response.json();
};
