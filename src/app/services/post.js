import { fetchWithAuth } from "./userAuthentication";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const getPosts = async (pageNum) => {
  const response = await fetchWithAuth(`${apiURL}/posts?pageNum=${pageNum}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch posts");
  return await response.json();
};

export const createPost = async (postData) => {
  console.log("postData", postData);
  const response = await fetchWithAuth(`${apiURL}/posts`, {
    method: "POST",
    body: postData,
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const getPost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/posts/${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch post");
  return await response.json();
};

export const savePost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/posts/${postId}/save`, {
    method: "POST",
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
  const response = await fetchWithAuth(`${apiURL}/myposts/${postId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete post");
  return "Post deleted successfully";
};

export const likePostComment = async (postId, reaction, commentId = null) => {
  console.log("postId", postId);
  console.log("reaction", reaction);
  const url =
    `${apiURL}/posts/${postId}/react` +
    (commentId ? `?commentId=${commentId}` : "");
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reaction }),
  });
  if (!response.ok) throw new Error("Failed to like post");
  return "Post liked successfully";
};

export const unlikePostComment = async (postId, commentId = null) => {
  const url =
    `${apiURL}/posts/${postId}/react` +
    (commentId ? `?commentId=${commentId}` : "");
  const response = await fetchWithAuth(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to unlike.");
  }
  return response.status;
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
    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404){
      return [];
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch comment replies: ${response.status}`);
    }
    return response.json();
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
 * @param {boolean} params.remove - Whether to remove the reaction
 * @returns {Promise<Object>} - Response data
 */
export async function reactToContent(postId, commentId, reaction = "Like", remove = false) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/react`;

    if (commentId) {
      url += `?commentId=${commentId}`;
    }

    const bodyContent = !remove ? { reaction } : undefined;

    const response = await fetchWithAuth(url, {
      method: remove ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent ? JSON.stringify(bodyContent) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${remove ? 'remove' : 'add'} reaction: ${response.status}`);
    }

    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error(`Error ${remove ? 'removing' : 'adding'} reaction:`, error);
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

export const addComment = async ({ postId, commentId, text, tags = [] }) => {
  try {
    let url = `${apiURL}/posts/${postId}/comment`;
    
    if (commentId) {
      url += `?commentId=${commentId}`;
    }

    const body = {
      text,
      tags,
    };

    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};


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
export async function deleteComment(postId, commentId) {
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

export const determineAge = (createdAt) => {
  const currentTime = new Date();
  const commentTime = new Date(createdAt);
  const timeDifference = currentTime - commentTime;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}m`;
  } else if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};
