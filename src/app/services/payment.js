const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const fetchSubscription = async () => {
  const authToken = getToken();

  if (!authToken) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch subscription data");
  return response.json();
};

export const fetchPlansDetails = async () => {
  const authToken = getToken();

  if (!authToken) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/plans`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch subscription data");
  return response.json();
};

export const cancelSubscription = async () => {
  const authToken = getToken();

  if (!authToken) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/subscriptions/cancel`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to cancel subscription");
  return response.json();
};

export const processPayment = async (paymentData) => {
  try {
    const authToken = getToken(); 
    
    if (!authToken) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...paymentData,
        token: authToken, 
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Payment failed");

    return result;
  } catch (error) {
    throw error;
  }
};
