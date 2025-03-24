/**
 * Normalizes raw job data from API to frontend-friendly structure.
 * @param {Object} job - Raw job data from API.
 * @returns {Object} Normalized job object.
 */
export function normalizeJob(job) {
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
      logo: job.companyData?.logo || "",
      location: job.companyData?.location || "",
    },
    title: job.title || "",
    location: job.location || "",
    workLocation: job.workLocation || "", // default fallback
    employmentType: job.employmentType || "",
    description: job.description || "",
    industry: job.industry || "",
    experience: job.experience || "Not specified",
    salary: typeof job.salary === "number" ? job.salary : null,
    isSavedByUser: !!job.isSavedByUser,
    createdAt: job.createdAt ? new Date(job.createdAt) : null,
    updatedAt: job.updatedAt ? new Date(job.updatedAt) : null,
  };
}
