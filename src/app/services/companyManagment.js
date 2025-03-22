import { fetchWithAuth } from "./userAuthentication";

const apiURL= process.env.NEXT_PUBLIC_API_URL;

export const postJob = async (jobData) => {
    try{
        const postJobResponse = await fetchWithAuth(`${apiURL}/company/job`, {
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

export const postedJobs = async () => {
    try{
        const postedJobsResponse = await fetchWithAuth(`${apiURL}/company/job`,{
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