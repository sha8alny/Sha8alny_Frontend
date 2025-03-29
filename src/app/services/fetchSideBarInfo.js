export const fetchSidebarInfo = async (data) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sidebar-info`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update custom URL");
    }
    return response.json();
  };
  