
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
            Authorization: `Bearer ${token.trim()}`,
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

//Get CompantId using username
export const getCompanyId = async (companyUsername) => {
    try{
        const response= await fetchWithAuth(`${apiURL}/getCompanyId/${companyUsername}`,{
            method: "GET",
            headers: { "Content-Type": "application/json", 
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` 
            },
        });
        console.log("Raw response object:", response);
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get companyId: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const updateApplication = async (jobId,applicantId, data) => {
    try {
      const response = await fetchWithAuth(`${apiURL}/employers/${jobId}/${applicantId}/application`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Failed to update application");
        const result = await response.json();
        console.log("Application updated successfully:", result);
        return result;
    } catch (error) {
      console.error("Error updating application:", error);
        return false;
    }
  };
  

export const createCompany = async (companyData) => {
    try {
        const response = await fetchWithAuth(`${apiURL}/company`, {
            method: "POST",
            body: companyData,
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to create company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
        
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCompany = async (companyUsername) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/company/${companyUsername}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", 
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` 
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to view company profile: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const updateCompany = async (companyUsername, companyData) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/company/${companyUsername}`, {
            method: "PATCH",
            body: companyData,
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to update company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message)
    }
};

export const deleteCompany = async (companyUsername) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/company/${companyUsername}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to delete company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const getDeletedCompanies = async(pageNum = 1)=>{
    try{
        const response = fetchWithAuth (`${apiURL}/company/restore?pageNum=${pageNum}`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get deleted company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};
export const restoreCompany = async (companyUsername) => {
    try{
        const response=  fetchWithAuth(`${apiURL}/company/${companyUsername}/restore`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to restore company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
};

export const serachCompany = async(text, pageNum = 1)=>{
    try{
        const response = fetchWithAuth (`${apiURL}/company/search?text=${encodeURIComponent(text)}&pageNum=${pageNum}`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get searched company: ${response.status} ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        } catch {
            return { message: responseText };
        }
    }catch(error){
        throw new Error(error.message);
    }
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