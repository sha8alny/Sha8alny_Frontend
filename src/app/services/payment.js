import { fetchWithAuth } from "./userAuthentication";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSubscription = async () => {
  const response = await fetchWithAuth(`${API_URL}/subscriptions`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch subscription data");
  return response.json();
};

export const fetchPlansDetails = async () => {
  const response = await fetchWithAuth(`${API_URL}/subscriptions/plans`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch subscription data");
  return response.json();
};

export const cancelSubscription = async () => {
  try {
    const response = await fetchWithAuth(`${API_URL}/subscriptions/cancel`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to cancel subscription');
    }

    return result;
    
  } catch (error) {
    throw new Error(error.message || 'Failed to cancel subscription');
  }
};

export const processPaymentMonthly = async (paymentData, maxRetries = 3) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/monthly`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      return result;
    } catch (error) {
      console.log("Error:", error);
      if (error.message !== "Failed to fetch") {
        return { error };
      }
      lastError = error;

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw lastError;
};
export const processPaymentOneTime = async (paymentData, maxRetries = 3) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/oneTime`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      return result;
    } catch (error) {
      console.log("Error:", error);

      if (error.message !== "Failed to fetch") {
        return { error };
      }
      lastError = error;

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw lastError;
};
