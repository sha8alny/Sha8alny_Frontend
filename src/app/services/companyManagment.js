
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

//List of companies owned by user
export const getUserCompanies = async (pageNum = 1) => {
    try{
        const response = await fetchWithAuth(`${apiURL}/company?pageNum=${pageNum}`,{
            method: "GET",
            headers: { "Content-Type": "application/json", 
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` 
            },
        });
        const responseText = await response.text(); 
        console.log("Raw response text:", responseText); 

        if (!response.ok) {
            console.error("Error response:", responseText);
            throw new Error(`Failed to get companies owned by user: ${response.status} ${responseText}`);
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

export const createCompany = async (companyData) => {
    try {
        const response = await fetchWithAuth(`${apiURL}/company`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(companyData),
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
        console.log("Updating company with data:", companyData);
        console.log("received username: ", companyUsername);
        const response = await fetchWithAuth(`${apiURL}/company/${companyUsername}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(companyData),
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
