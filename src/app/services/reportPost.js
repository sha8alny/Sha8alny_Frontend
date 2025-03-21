export const reportPost = async (postId, reason) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/report-post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        reason,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to report post");
  }
  return response.json();
};
