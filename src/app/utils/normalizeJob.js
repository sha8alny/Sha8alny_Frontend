/**
 * Normalizes raw job data from API to frontend-friendly structure.
 * @param {Object} job - Raw job data from API.
 * @returns {Object} Normalized job object.
 */
export function normalizeJob(job) {
  /**
   * Validates if a string is a valid URL that can be used in Next.js Image component.
   * @param {string} url - The URL string to validate.
   * @returns {boolean} True if valid and allowed, false otherwise.
   */
  function isValidUrl(url) {
    if (!url) return false;
    
    // If it's a relative URL, it's always valid in Next.js
    if (url.startsWith('/')) return true;
    
    // Handle blob URLs (used for local file objects)
    if (url.startsWith('blob:')) return true;
    
    try {
      const parsedUrl = new URL(url);
      // List of domains allowed in your Next.js config
      const allowedDomains = [
        // Add your allowed domains here
        'localhost',
        process.env.NEXT_PUBLIC_API_URL,
        // Add more as configured in next.config.js
      ];
      
      return allowedDomains.includes(parsedUrl.hostname);
    } catch (_) {
      return false;
    }
  }
  
  function formatSalary(salary) {
    if (!salary) return "Salary: undisclosed";
    return `Salary: ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary)}`;
  }

  // Handle arrays of jobs
  if (Array.isArray(job)) {
    return job.map((item) => normalizeJob(item));
  }

  // Handle single job object
  return {
    id: job._id || job.id || "",
    company: {
      id: job.companyData?.id || "",
      name: job.companyData?.name || "",
      username: job.companyData?.username || "",
      logo: isValidUrl(job.companyData?.logo) ? job.companyData?.logo : "",
      location: job.companyData?.location || null
    },
    title: job.title || "",
    location: job.location || "",
    workLocation: job.workLocation || "", // default fallback
    employmentType: job.employmentType || "",
    description: job.description || "",
    industry: job.industry || "",
    experience: job.experience || "Not specified",
    salary: (typeof job.salary === "number" || typeof job.salary === "string") 
           ? job.salary 
           : null,
    salaryFormatted: formatSalary(job.salary),
    isSavedByUser: !!job.isSavedByUser,
    createdAt: job.createdAt ? new Date(job.createdAt) : null,
    updatedAt: job.updatedAt ? new Date(job.updatedAt) : null,
  };
}
