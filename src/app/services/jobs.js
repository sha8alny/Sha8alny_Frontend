
const apiURL  = process.env.NEXT_PUBLIC_JOBS_API_URL;


export const fetchJobListings = async ({ pageParam = 1 }) => {
    const itemsPerPage = 5;
    const url = new URL(
      `${apiURL}/search/${pageParam}`
    );
    url.searchParams.append("limit", itemsPerPage);
    //console.log(url.toString());
    const response = await fetch(url.toString());
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
  
    return { data, nextPage: data.length === itemsPerPage ? pageParam + 1 : null };
  };

  export const fetchAppliedJobs = async () => {
    const response = await fetch(`${apiURL}/applied`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };

  export const fetchSavedJobs = async ({pageParam = 1}) => {
    const itemsPerPage = 5;
    const url = new URL(
      `${apiURL}saved/${pageParam}`
    );
    url.searchParams.append("limit", itemsPerPage);
    //console.log(url.toString());
    const response = await fetch(url.toString());
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
  
    return { data, nextPage: data.length === itemsPerPage ? pageParam + 1 : null };
  };
  
  export const fetchJobDetails = async (id) => {
    const response = await fetch(`${apiURL}${id}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };

  export const submitJobApplication = async (jobId, data, resume) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("coverLetter", data.coverLetter);
    formData.append("jobId", jobId);
    if (resume) {
      formData.append("resume", resume);
    }
  
    const response = await fetch(
      `${apiURL}/${jobId}/apply`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to submit application");
    }
  };
  


export const fetchJobListingsPageNumber = async ({ pageParam = 1 }) => {
  const itemsPerPage = 10;
  const url = new URL(
    `${apiURL}/jobs/search/${pageParam}`
  );


  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
    prevPage: pageParam > 1 ? pageParam - 1 : null,
  };
};

