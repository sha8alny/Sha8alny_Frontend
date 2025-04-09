
import { use } from "react";
import { fetchWithAuth } from "./userAuthentication";

const apiURL= process.env.NEXT_PUBLIC_API_URL;

export const postJob = async ({jobData, username}) => {
    const token=sessionStorage.getItem("accessToken");
    console.log("token:",token);
    console.log("jobData:",jobData);
    console.log("username:",username);
    const companyUsername =username
    try{
        const postJobResponse = await fetchWithAuth(`${apiURL}/company/${companyUsername}/job`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token.trim()}`,
          },
          
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

export const postedJobs = async ({page, companyUsername}) => {
    try {
      console.log("Fetching jobs for page:", page);
      console.log("companyUsername:", companyUsername);
      const pageSize = 5
      const queryParams = new URLSearchParams({
        company: companyUsername,
      });
      
      const url = `${apiURL}/jobs/search/${page}/${pageSize}?${queryParams}`;
      console.log("➡️ Final fetch URL:", url);
      
      const postedJobsResponse = await fetchWithAuth(
        `${apiURL}/jobs/search/${page}/${pageSize}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (!postedJobsResponse.ok) {
        throw new Error("Failed to fetch jobs");
      }
  
      const contentLength = postedJobsResponse.headers.get("content-length");
      if (contentLength && parseInt(contentLength) === 0) {
        console.warn("No content returned (empty JSON).");
        return []; // return empty array to avoid crashing
      }
  
      const text = await postedJobsResponse.text();
      if (!text) {
        console.warn("Empty response body.");
        return []; // again, safe fallback
      }
  
      const data = JSON.parse(text);
      console.log("Fetched jobs", data);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const deleteJob = async ({companyUsername,jobId}) => {
    const token = sessionStorage.getItem("accessToken");
    console.log("token:", token);
    try {
        const deleteJobResponse = await fetchWithAuth(`${apiURL}/company/${companyUsername}/job/${jobId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`,
            },
        });
        if (!deleteJobResponse.ok) {
            throw new Error("Failed to delete job");
        }
        return await deleteJobResponse.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editJob = async ({companyUsername, jobId, jobData}) => {
    const token = sessionStorage.getItem("accessToken");
    console.log("token:", token);
    console.log("jobData:", jobData);
    try {
        const editJobResponse = await fetchWithAuth(`${apiURL}/company/${companyUsername}/job/${jobId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`,
            },
            body: JSON.stringify(jobData),
        });
        if (!editJobResponse.ok) {
            throw new Error("Failed to edit job");
        }
        return await editJobResponse.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
  


export const JobApplicants = async (jobId, page = 1) => {
    const token = sessionStorage.getItem("accessToken");
    console.log("token:", token);
    console.log("Fetching applicants for jobId:", jobId);
    const pageSize = 5;
    try{
        const applicantsResponse = await fetchWithAuth(`${apiURL}/employers/${jobId}/applicants/${page}/${pageSize}`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!applicantsResponse.ok) {
            throw new Error("Failed to fetch applicants");}
        const text = await applicantsResponse.text();
        if (!text) {
            console.warn("Empty response body.");
            return []; 
        }
        const data = JSON.parse(text);
        console.log(`fetched page ${page} applicants:`,data);
        return data;
    } catch(error){
        throw new Error(error.message);
    }
};

export const getApplication = async (jobId, applicantId) => {
    const token = sessionStorage.getItem("accessToken");
    console.log("token:", token);
    try{
        const applicationResponse = await fetchWithAuth(`${apiURL}/employers/${jobId}/${applicantId}/application`,{
            method: "GET",
            headers: { "Content-Type": "application/json" },
            Authorization: `Bearer ${token.trim()}`,
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

export const updateApplication = async (jobId,applicantId, data) => {
    try {
      const response = await fetchWithAuth(`${apiURL}/employers/${jobId}/${applicantId}/application`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Failed to update application");
    } catch (error) {
      console.error("Error updating application:", error);
    }
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

export const getUserCompanies = async (page) => {
    const response = await fetchWithAuth(`${apiURL}/company?pageNum=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error === "Companies not found") {
        throw new Error("No companies found for the given query.");
      }
      throw new Error("Failed to fetch companies.");
    }
    return await response.json();
  };
  