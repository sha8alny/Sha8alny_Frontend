/**
 * Fetches comments for a specific post with pagination
 *
 * @param {string} postId - The ID of the post to fetch comments for
 * @param {Object} paginationParams - Pagination parameters
 * @param {number} paginationParams.page - The page number (starting from 1)
 * @param {number} paginationParams.limit - Number of comments per page
 * @returns {Promise<Object>} - The paginated comments and metadata
 */
export const getPostComments = async (
  postId,
  paginationParams = { page: 1, limit: 10 }
) => {
  try {
    const { page, limit } = paginationParams;
    const offset = (page - 1) * limit;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    const data = await response.json();

    return {
      comments: data.comments || [],
      totalComments: data.totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((data.totalCount || 0) / limit),
      hasMore: offset + data.comments.length < data.totalCount,
    };
  } catch (error) {
    console.error("Error fetching post comments:", error);
    throw error;
  }
};
