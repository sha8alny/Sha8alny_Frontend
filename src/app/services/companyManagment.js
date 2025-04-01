
import { fetchWithAuth } from "./userAuthentication";

const apiURL= process.env.NEXT_PUBLIC_API_URL;

export const postJob = async (jobData, companyUsername) => {
    try{
        const postJobResponse = await fetchWithAuth(`${apiURL}/company/${companyUsername}/job`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });

        if (!postJobResponse.ok) {
            throw new Error("Failed to post job");
        }
        console.log(postJobResponse);
        return await postJobResponse.json();
    }catch(error){
        throw new Error(error.message);
    }
};

export const postedJobs = async (companyUsername) => {
    try{
        const postedJobsResponse = await fetchWithAuth(`${apiURL}/company/${companyUsername}/job`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!postedJobsResponse.ok) {
            throw new Error("Failed to fetch jobs");}
        const data = await postedJobsResponse.json();
        console.log("Fetched jobs",data);
        console.log("is array:",Array.isArray(data));
        return data;
        }catch(error){
            throw new Error(error.message);
        }
};


export const JobApplicants = async (jobId, page = 1) => {
    try{
        const applicantsResponse = await fetchWithAuth(`${apiURL}/employers/${jobId}/applicants/${page}`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!applicantsResponse.ok) {
            throw new Error("Failed to fetch applicants");}
        const data = await applicantsResponse.json();
        console.log(`fetched page ${page} applicants:`,data);
        return data;
    } catch(error){
        throw new Error(error.message);
    }
};

export const getApplication = async (jobId, applicantId) => {
    try{
        const applicationResponse = await fetchWithAuth(`${apiURL}/employers/${jobId}/${applicantId}/application`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!applicationResponse.ok) {
            throw new Error("Failed to fetch application");}
        const data = await applicationResponse.json();
        console.log("Fetched application:",data);
        return data;
    } catch(error){
        throw new Error(error.message);
    };
};


export const createCompany = async (companyData) => {
    const response =await fetch(`${apiURL}/company`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
    });
    if(!response.ok) throw new Error("Failed to create company");
    return await response.json();
};

export const getCompany = async (companyUsername) => {
    const response = await fetch(`${apiURL}/company/${companyUsername}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)  throw new Error("Failed to fetch company details");
    return await response.json();
};

export const updateCompany = async (companyUsername, companyData) => {
    const response = await fetch(`${apiURL}/company/${companyUsername}/edit`, {
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
    const response = await fetch(`${apiURL}/company/${companyUsername}/edit`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Failed to delete company");
    return "Company deleted successfully";
};

export const followCompany = async (companyUsername) => {
    const response = await fetch(`http://localhost:5000/company/${companyUsername}/follow`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Failed to follow company");
    return await response.json();
}