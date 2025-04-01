import { fetchWithAuth } from "./userAuthentication";

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

export const createPost = async (postData) => {
  console.log("postData", postData);
  const response = await fetch(`${apiURL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return await response.json();
};

export const getPost = async (postId) => {
  const response = await fetch(`${apiURL}/posts/${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch post");
  return await response.json();
};

export const savePost = async (postId) => {
  const response = await fetch(`${apiURL}/posts/${postId}/save`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error("Failed to save post");
  return "Post saved successfully";
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${apiURL}/posts/${postId}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to update post");
  return await response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${apiURL}/posts/${postId}/edit`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error("Failed to delete post");
  return "Post deleted successfully";
};

export const likePost = async (postId) => {
  const response = await fetch(`${apiURL}/posts/${postId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
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

/**
 * Get comments or replies for a post with pagination
 * @param {string} postId - The ID of the post
 * @param {string|null} commentId - The ID of the comment (null for top-level comments)
 * @param {number} pageNum - The page number for pagination
 * @returns {Promise<Array>} - Array of comments or replies
 */
export async function getCommentReplies(postId, commentId, pageNum = 1) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment?pageNum=${pageNum}`;
    if (commentId) {
      url += `&commentId=${commentId}`;
    }
    const response = await fetchWithAuth(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching comment replies:", error);
    throw error;
  }
}

/**
 * React to a post/comment/reply
 * @param {Object} params
 * @param {string} params.postId - The ID of the post
 * @param {string} params.commentId - The ID of the comment (undefined for post reactions)
 * @param {string} params.reaction - The reaction type
 * @returns {Promise<Object>} - Response data
 */
export async function reactToContent({ postId, commentId, reaction = 'Like' }) {
  try {
    // Construct URL with commentId as a query parameter if it exists
    let url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/react`;
    
    if (commentId) {
      url += `?commentId=${commentId}`;
    }
    
    const response = await fetchWithAuth(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to react: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error reacting to content:", error);
    throw error;
  }
}

/**
 * Comment or reply on a post
 * @param {Object} params
 * @param {string} params.postId - The ID of the post
 * @param {string} params.commentId - The ID of the parent comment (undefined for top-level comments)
 * @param {string} params.text - The comment/reply text
 * @param {Array<string>} params.tags - Optional tags for the comment
 * @returns {Promise<Object>} - Response data
 */
export async function addComment({ postId, commentId, text, tags = [] }) {
  try {
    // Construct URL with commentId as a query parameter if it exists
    let url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment`;
    
    if (commentId) {
      url += `?commentId=${commentId}`;
    }
    
    const response = await fetchWithAuth(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, tags }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

/**
 * Update a comment or reply
 * @param {Object} params
 * @param {string} params.postId - The ID of the post
 * @param {string} params.commentId - The ID of the comment to update
 * @param {string} params.text - The updated comment/reply text
 * @param {Array<string>} params.tags - Optional updated tags for the comment
 * @returns {Promise<Object>} - Response data
 */
export async function updateComment({ postId, commentId, text, tags = [] }) {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment?commentId=${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, tags }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

/**
 * Delete a comment or reply
 * @param {Object} params
 * @param {string} params.postId - The ID of the post
 * @param {string} params.commentId - The ID of the comment to delete
 * @returns {Promise<Object>} - Response data
 */
export async function deleteComment({ postId, commentId }) {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment?commentId=${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

// export const addComment = async (postId, text) => {
//   const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({ text }),
//   });
//   if (!response.ok) throw new Error("Failed to add comment");
//   return "Comment added successfully";
// };

// export const deleteComment = async (postId, commentId) => {
//   const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   if (!response.ok) throw new Error("Failed to delete comment");
//   return "Comment deleted successfully";
// };

export const likeComment = async (postId, commentId) => {
  const response = await fetch(
    `${apiURL}/posts/${postId}/comment/${commentId}/like`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
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
