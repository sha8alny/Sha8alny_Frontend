const apiURL  = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./userAuthentication";

export const searchCompany = async (text, pageNum) => {
    const response = await fetchWithAuth(`${apiURL}/search/company?text=${encodeURIComponent(text)}&pageNum=${pageNum}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Failed to search company");
    return response.json();
};


export const searchUser = async(text,industry,company, pageNum) => {
    const response = await fetchWithAuth(`http://localhost:5000/search/user?text=${encodeURIComponent(text)}&industry=${encodeURIComponent(industry)}&company=${encodeURIComponent(company)}&pageNum=${pageNum}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Failed to search user");
    return response.json();
}

export const fetchJobListings = async (text, pageNum) => {
    const response = await fetchWithAuth(`${apiURL}/jobs/search/${pageNum}/${3}?keyword=${encodeURIComponent(text)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Failed to search job listings");
    return response.json();
};