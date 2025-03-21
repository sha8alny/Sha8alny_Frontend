const API_URL="http://localhost:3001";

export const createCompany = async (companyData) => {
    const response =await fetch(`${API_URL}/company`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
    });
    if(!response.ok) throw new Error("Failed to create company");
    return await response.json();
};

export const getCompany = async (companyUsername) => {
    const response = await fetch(`${API_URL}/company/${companyUsername}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)  throw new Error("Failed to fetch company details");
    return await response.json();
};

export const updateCompany = async (companyUsername, companyData) => {
    const response = await fetch(`${API_URL}/company/${companyUsername}/edit`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error("Failed to update company");
    return await response.json();
};

export const deleteCompany = async (companyUsername) => {
    const response = await fetch(`${API_URL}/company/${companyUsername}/edit`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Failed to delete company");
    return "Company deleted successfully";
};
