export const postJob = async (jobData) => {
    try{
        const postJobResponse = await fetch("http://localhost:3000/company/job", {
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
        const postedJobsResponse = await fetch ("http://localhost:3000/company/job",{
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