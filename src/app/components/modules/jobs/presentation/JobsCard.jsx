import SafeImage from "@/app/components/ui/SafeImage";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * Renders a job tag component with a given label.
 * @param {Object} props - The component props.
 * @param {string} props.tag - The tag text.
 * @returns {JSX.Element} The JobTag component.
 */
function JobTag({ tag }) {
  return (
    <span className="bg-gray-200 text-xs text-text px-2 py-1 rounded-sm dark:bg-gray-700 ">
      {tag}
    </span>
  );
}

/**
 * Renders a collection of job tags.
 * @param {Object} props - The component props.
 * @param {string} [props.employmentType] - The type of employment (e.g., Full-time, Part-time).
 * @param {string} [props.workLocation] - The job work location.
 * @returns {JSX.Element} The JobTags component.
 */
function JobTags({ employmentType, workLocation }) {
  const tags = [employmentType, workLocation].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tags.map((tag, index) => (
        <JobTag key={index} tag={tag} />
      ))}
    </div>
  );
}

/**
 * Renders an individual job card.
 * @param {Object} props - The component props.
 * @param {Object} props.job - The normalized job details.
 * @param {Function} props.onClick - Callback function when the job card is clicked.
 * @returns {JSX.Element} The JobCard component.
 */
export function JobCard({ job, onClick }) {
  const getRelativeTimeString = (date) => {
    try {
      if (!date) return "Recently";

      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div
      className="flex space-x-4 p-4 bg-foreground rounded-lg hover:shadow-md transition-shadow hover:bg-hover shadow-sm duration-200 cursor-pointer"
      onClick={() => onClick(job)}
      data-testid={`job-card-${job._id}`}
    >
      <div className="w-16 h-16 shrink-0 bg-background flex items-center justify-center rounded-sm ">
        <SafeImage 
          src={job.company.logo}
          width={48}
          height={48}
          alt={job.company.name || "Company Logo"}
          className="w-full h-full object-cover rounded-sm"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-text">{job.title}</h3>
        <p className="text-sm text-gray-400">
          {job.company.name} • {job.location}
        </p>
        <JobTags
          employmentType={job.employmentType}
          workLocation={job.workLocation}
        />
        <p className="text-sm dark:text-gray-300 text-gray-500 line-clamp-2">
          {job.description}
        </p>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>Posted {getRelativeTimeString(job.createdAt)}</span>
          <span className="font-medium">{job.salaryFormatted}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a list of job cards.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.jobListings - The list of normalized job listings.
 * @param {Function} [props.handleJobClick] - The callback function when a job card is clicked.
 * @returns {JSX.Element} The JobsCard component.
 */
function JobsCard({ jobListings = [], handleJobClick = () => {} }) {
  if (!jobListings.length) {
    return (
      <div className="text-center py-6 text-text">
        No job listings available at the moment.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-3 mb-4">
        {jobListings.map((job, index) => (
          <div className="mb-6" key={`${job._id}-${index}`}>
          <JobCard
            job={job}
            onClick={handleJobClick}
          />
          </div>
        ))}
      </div>
    </>
  );
}
export default JobsCard;
