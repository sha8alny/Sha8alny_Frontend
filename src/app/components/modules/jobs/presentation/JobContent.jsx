/**
 * Component to display job content.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Job details.
 * @param {boolean} props.isLoading - Loading state.
 * @returns {JSX.Element} The rendered component.
 */
export default function JobContent({ job, isLoading }) {
  const hasDetails = job?.type || job?.salary || job?.time || job?.description;
  if (isLoading || !hasDetails) {
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
 * Component to display job tags.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Job details.
 * @returns {JSX.Element} The rendered component.
 */

function JobTags({ job }) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {job.employment_type && (
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {job.employment_type}
        </span>
      )}
      {job.salary && (
        <span
          className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
          title="Salary"
        >
          {job.salary}
        </span>
      )}
      {job.time && (
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
          Posted: {new Date(job.time).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

/**
 * Component to display job description.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Job details.
 * @returns {JSX.Element} The rendered component.
 */
function JobDescription({ job }) {
  return (
    <div className="mb-6 mt-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Job Description
      </h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {job.description}
      </p>
    </div>
  );
}

/**
 * Component to display job requirements.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.job - Job details.
 * @returns {JSX.Element} The rendered component.
 */
function JobRequirements({ job }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Requirements</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {job?.experience || "0 years"} of experience
        {job?.requirements?.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
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
