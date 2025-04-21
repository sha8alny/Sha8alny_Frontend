import { fetchWithAuth } from "./userAuthentication";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const getMyPosts = async (pageNum, companyId) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/myPosts?pageNum=${pageNum}&companyId=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to update post: ${response.status} ${responseText}`
      );
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

export const getProfilePosts = async (
  pageNum,
  profileId,
  isCompany = false
) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/profilePosts/${profileId}?pageNum=${pageNum}&isCompany=${isCompany}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMyPosts = async (postId, postData) => {
  try {
    const response = await fetchWithAuth(`${apiURL}/myPosts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(postData),
    });
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to update post: ${response.status} ${responseText}`
      );
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

export const getPosts = async (pageNum) => {
  const response = await fetchWithAuth(`${apiURL}/posts?pageNum=${pageNum}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch posts");
  return await response.json();
};

export const createPost = async (postData, companyId = null) => {
  console.log("postData", postData);
  let url = `${apiURL}/posts`;
  if (companyId) {
    url += `?companyId=${companyId}`;
  }
  const response = await fetchWithAuth(url, {
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

export const restoreDeletedPosts = async (postId) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/myPosts/restore/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to restore deleted posts: ${response.status} ${responseText}`
      );
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

export const savePost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/posts/${postId}/save`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to save post");
  return "Post saved successfully";
};

export const deletePost = async (postId) => {
  const response = await fetchWithAuth(`${apiURL}/myposts/${postId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete post");
  return "Post deleted successfully";
};

export const repostPost = async (postId) => {
  const response = await fetchWithAuth(
    `${apiURL}/posts/${postId}/share`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to repost post");
  }
  return response.json();
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
    if (response.status === 404) {
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
export async function reactToContent(
  postId,
  commentId,
  reaction = "Like",
  remove = false
) {
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
      throw new Error(
        `Failed to ${remove ? "remove" : "add"} reaction: ${response.status}`
      );
    }

    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error(`Error ${remove ? "removing" : "adding"} reaction:`, error);
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

export const sharePost = async (postId) => {
  try {
    const response = await fetchWithAuth(`${apiURL}/posts/${postId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer${sessionStorage.getItem("accessToken")}`,
      },
    });
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to share post: ${response.status} ${responseText}`
      );
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

export const unsharePost = async (postId) => {
  try {
    const response = await fetchWithAuth(`${apiURL}/posts/${postId}/share`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer${sessionStorage.getItem("accessToken")}`,
      },
    });
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to unshare post: ${response.status} ${responseText}`
      );
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

export const getTags = async (text) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/tags?text=${encodeURIComponent(text)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to fetch tags: ${response.status} ${responseText}`
      );
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
export const getSavedPosts = async (pageNum = 1) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/save/posts?pageNum=${pageNum}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );

    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(
        `Failed to get saved posts: ${response.status} ${responseText}`
      );
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

export const fetchTrendingTopics = async () => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/trends`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trending topics");
  }
  return response.json();
};
