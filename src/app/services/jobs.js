import { fetchWithAuth } from "@/app/services/userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


/**
 * Fetches job listings with experimental API endpoint
 * 
 * @param {Object} options - The fetch options
 * @param {number} options.pageParam - The page number to fetch
 * @param {Object} options.filters - Filter parameters for the search
 * @param {string|null} options.sortBy - Sorting parameter
 * @param {number} options.itemsPerPage - Number of items per page
 * @returns {Promise<Object>} The job listings data
 */
export const fetchJobListings = async ({
  pageParam = 1,
  filters = {},
  sortBy = null,
  itemsPerPage = 10,
}) => {
  const url = new URL(`${apiURL}/jobs/search/${pageParam}/${itemsPerPage}`);
  
  // Add any filters from the filters object
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });
  
  // Add sorting if provided
  if (sortBy) {
    url.searchParams.append("sort", sortBy);
  }
  
  try {
    const response = await fetchWithAuth(url.toString());
    
    if (response.status === 204) {
      return { data: [], nextPage: null, currentPage: pageParam };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      data: data.jobs || data, // Handle different API response formats
      nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
      currentPage: pageParam,
      totalCount: data.totalCount || data.length || 0
    };
  } catch (error) {
    console.error("Error fetching job listings:", error);
    throw error;
  }
};


/**
 * Fetches available filter options for job search
 * 
 * @returns {Promise<Object>} The filter options
 */
export const fetchFilterOptions = async () => {
  try {
    // Fetch options from the API with a reasonable limit
    const limit = 20; // Adjust the limit as needed for filter options
    const response = await fetchWithAuth(`${apiURL}/jobs/filter/options/${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }
    
    const data = await response.json();
    
    // Structure the response to match expected format
    return {
      location: data.locations || [],
      industry: data.industries || [],
      experienceLevel: data.experiences || [],
      company: data.companies || [],
      employmentType: ["Full-time", "Part-time", "Internship"], // Default options
      workLocation: ["Remote", "Onsite", "Hybrid"], // Default options
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    // Return fallback options in case of error
    return {
      location: [],
      industry: [],
      experienceLevel: [],
      company: [],
      employmentType: ["Full-time", "Part-time", "Internship"], // Default options
      workLocation: ["Remote", "Onsite", "Hybrid"], // Default options
    };
  }
};



export const fetchAppliedJobs = async ({ pageParam = 1 }) => {
  const itemsPerPage = 5;
  const url = new URL(`${apiURL}/jobs/applied/${pageParam}/${itemsPerPage}`);

  try {
    const response = await fetchWithAuth(url.toString());

    if (response.status === 204) {
      return { data: [], nextPage: null };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data,
      nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    throw error;
  }
};

export const fetchSavedJobs = async ({ pageParam = 1 }) => {
  const itemsPerPage = 5;
  const url = new URL(`${apiURL}/jobs/saved/${pageParam}/${itemsPerPage}`);

  //console.log(url.toString());
  const response = await fetchWithAuth(url.toString());
  if (response.status === 204) {
    return { data: [], nextPage: null };
  }
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return {
    data,
    nextPage: data.length === itemsPerPage ? pageParam + 1 : null,
  };
};

export const fetchJobDetails = async (id) => {
  const response = await fetchWithAuth(`${apiURL}/jobs/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const submitJobApplication = async (jobId, data, resume) => {
  const formData = new FormData();
  // formData.append("name", data.name);
  // formData.append("email", data.email);
  // formData.append("jobId", jobId);
  formData.append("phoneNumber", data.phone);
  if (data.coverLetter) {
    formData.append("coverLetter", data.coverLetter);
  }
  formData.append("resume", resume);

  const response = await fetchWithAuth(`${apiURL}/jobs/${jobId}/apply`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit application");
  }
};

export const saveJob = async (jobId, action = "save") => {
  const method = action === "unsave" ? "DELETE" : "POST";

  const response = await fetchWithAuth(`${apiURL}/jobs/${jobId}/save`, {
    method: method,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const fetchJobListingsPageNumber = async ({ pageParam = 1 }) => {
  const itemsPerPage = 10;
  const url = new URL(`${apiURL}/jobs/search/${pageParam}`);

  const response = await fetchWithAuth(url.toString());
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
