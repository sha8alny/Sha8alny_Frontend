/**
 * @namespace jobs
 * @module jobs
 */
/**
 * Component to display job content.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Normalized job details.
 * @param {boolean} props.isLoading - Loading state.
 * @returns {JSX.Element} The rendered component.
 */
export default function JobContent({ job, isLoading }) {
  // Check if job is null/undefined or has required details
  if (isLoading || !hasJobDetails(job)) {
    return <LoadingState />;
  }

  return (
    <>
      <JobTags job={job} />
      <JobDescription job={job} />
      <JobRequirements job={job} />
    </>
  );
}

/**
 * Helper function to check if job has meaningful details
 * 
 * @param {Object} job - Job object to check
 * @returns {boolean} Whether job has necessary details
 */
function hasJobDetails(job) {
  return job.employmentType || job.salary || job.createdAt || job.description || job.experience || job.industry || job.location;
}

/**
 * Component to display job tags.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Normalized job details.
 * @returns {JSX.Element} The rendered component.
 */
function JobTags({ job = {} }) {
  const tags = [
    {
      value: job.employmentType,
      label: job.employmentType,
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      value: job.workLocation,
      label: job.workLocation,
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      title: "Work Location",
      condition: job.workLocation && job.workLocation !== "unknown",
    },
    {
      value: job.salary,
      label: `$${job.salary}`,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      title: "Annual Salary",
    },
    {
      value: job.createdAt,
      label: `Posted: ${job.createdAt?.toLocaleDateString()}`,
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-3" aria-label="Job details">
      {tags.map(
        (tag, index) =>
          (tag.condition !== undefined ? tag.condition : tag.value) && (
            <span
              key={index}
              className={`${tag.className} text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-colors`}
              title={tag.title}
            >
              <span className="text-xs">{tag?.icon}</span>
              {tag.label}
            </span>
          )
      )}
    </div>
  );
}

/**
 * Component to display job description.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Normalized job details.
 * @returns {JSX.Element} The rendered component.
 */
function JobDescription({ job = {} }) {
  if (!job.description) {
    return null;
  }
  
  return (
    <div className="mb-6 mt-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-300">
        Job Description
      </h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line dark:text-gray-400">
        {job.description}
      </p>
    </div>
  );
}

/**
 * Component to display job requirements.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Normalized job details.
 * @returns {JSX.Element} The rendered component.
 */
function JobRequirements({ job = {} }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-300">
        Requirements
      </h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-400">
        <li>Experience: {job?.experience || "Not specified"}</li>
        <li>Industry: {job?.industry || "General"}</li>
        <li>Location: {job?.location || "Unknown Location"}</li>
      </ul>
    </div>
  );
}

/**
 * Component to display loading state.
 *
 * @returns {JSX.Element} The rendered component.
 */
function LoadingState() {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="bg-gray-200 text-gray-200 text-sm font-medium px-3 py-1 rounded-full animate-pulse">
          Loading type...
        </span>
        <span className="bg-gray-200 text-gray-200 text-sm font-medium px-3 py-1 rounded-full animate-pulse">
          Loading salary...
        </span>
        <span className="bg-gray-200 text-gray-200 text-sm font-medium px-3 py-1 rounded-full animate-pulse">
          Loading date...
        </span>
      </div>

      <div className="mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-300">
          Job Description
        </h2>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-5/6"></div>
          <p className="text-gray-500 mt-2 animate-pulse">
            Loading job details...
          </p>
        </div>
      </div>
    </>
  );
}

