export const reportUser = async (username, data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to report user");
    }
    return response.status;
}