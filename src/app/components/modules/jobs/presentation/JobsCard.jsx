import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
 * @param {string} [props.location] - The job location.
 * @returns {JSX.Element} The JobTags component.
 */
function JobTags({ employmentType, location }) {
    const tags = [employmentType, location].filter(Boolean);
    
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
 * @param {Object} props.job - The job details.
 * @param {string} props.job.title - The job title.
 * @param {string} props.job.location - The job location.
 * @param {string} props.job.employment_type - The employment type.
 * @param {string} props.job.work_location - The work location.
 * @param {string} props.job.description - The job description.
 * @param {Object} props.job.company_data - The company details.
 * @param {string} props.job.company_data.name - The company name.
 * @param {string} props.job.time - The job posting date.
 * @param {string} [props.job.salary] - The job salary.
 * @param {Function} props.onClick - Callback function when the job card is clicked.
 * @returns {JSX.Element} The JobCard component.
 */
function JobCard({ job, onClick }) {
    const getRelativeTimeString = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return `${Math.floor(diffDays / 30)} months ago`;
        } catch {
            return 'Recently';
        }
    };

    const company = job.company_data;

    return (
        <div 
            className="flex space-x-4 p-4 rounded-lg hover:bg-hover transition-colors duration-200 cursor-pointer"
            onClick={() => onClick(job)} 
        >
            <div
                className="w-16 h-16 shrink-0 bg-background flex items-center justify-center rounded-sm"
            >
                <div className="w-12 h-12 relative">
                    <Image
                        src={false || "/api/placeholder/48/48"}
                        width={48}
                        height={48}
                        alt={company.name}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-text">{job.title || "Job Opening"}</h3>
                <p className="text-sm text-gray-400">{company.name} • {job.location}</p>
                <JobTags employmentType={job.employment_type} location={job.work_location} />
                <p className="text-sm text-gray-300 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span>Posted {getRelativeTimeString(job.time)}</span>
                    <span className="font-medium">{job.salary ? `Salary: ${job.salary} $` : 'Salary: undisclosed'}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Renders a list of job cards.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.jobListings - The list of job listings.
 * @param {Function} [props.handleJobClick] - The callback function when a job card is clicked.
 * @returns {JSX.Element} The JobsCard component.
 */
function JobsCard({ jobListings = [], handleJobClick = () => {} }) {


    if (!jobListings.length) {
        return <div className="text-center py-6 text-text">No job listings available at the moment.</div>;
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-text">Explore</h2>
            <div className="space-y-4">
                {jobListings.map((job, index) => (
                    <JobCard key={job.job_id || index} job={job} onClick={handleJobClick} />
                ))}
            </div>
        </>
    );
}

export default JobsCard;
