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
  const response = await fetchWithAuth(`${API_URL}/plans`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch subscription data");
  return response.json();
};

export const cancelSubscription = async () => {
  const response = await fetchWithAuth(`${API_URL}/subscriptions/cancel`, {
    method: "DELETE",
    headers: {},
  });

  if (!response.ok) throw new Error("Failed to cancel subscription");
  return response.json();
};

export const processPaymentMonthly = async (paymentData) => {
  try {
    console.log(paymentData);

    const response = await fetchWithAuth(`${API_URL}/subscriptions/monthly`, {
      method: "PATCH",

      body: JSON.stringify({
        ...paymentData,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Payment failed");
   
 
    return result;
  } catch (error) {
    throw error;
  }
};
export const processPaymentOneTime = async (paymentData) => {
  try {
    console.log(paymentData);

    const response = await fetchWithAuth(`${API_URL}/subscriptions/oneTime`, {
      method: "PATCH",

      body: JSON.stringify({
        ...paymentData,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Payment failed");
   
 
    return result;
  } catch (error) {
    throw error;
  }
};
