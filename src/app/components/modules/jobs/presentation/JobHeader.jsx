import SafeImage from "@/app/components/ui/SafeImage";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

/**
 * @namespace jobs
 * @module jobs
 */
/**
 * JobHeader component displays the header section of a job listing.
 * Pure presentation component that receives all data from container.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.job - The normalized job data.
 * @param {string} props.job.title - The title of the job.
 * @param {Object} props.job.company - The company data.
 * @param {string} props.job.company.name - The name of the company.
 * @param {string} props.job.company.location - The location of the company.
 * @param {string} props.job.company.logo - The URL of the company's logo.
 * @param {boolean} props.isLoading - Flag indicating if the job data is still loading.
 * @returns {JSX.Element} The rendered JobHeader component.
 */
function JobHeader({ job, isLoading }) {
  const defaultLogo = "https://picsum.photos/96/96";
  const companyName = job?.company?.name || "";
  const companyLocation = job?.company?.location || "";
  const companyLogo = job?.company?.logo || defaultLogo;
  const jobTitle = job?.title || "";

  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text">
          {isLoading ? "Loading job title..." : jobTitle}
        </h1>
        {!isLoading && (
          <div className="w-24 h-24 relative flex items-center justify-center border border-blue-300 mr-4 rounded-md">
            <SafeImage
              src={companyLogo}
              width={96}
              height={96}
              alt={`${companyName} logo`}
              className="w-full h-full object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-3 text-gray-700 dark:text-gray-300">
        <span className="font-semibold text-lg">
          {isLoading ? "Loading company name..." : companyName}
        </span>
        {companyName && <span className="text-gray-400">•</span>}
        <span className="flex items-center text-lg">
          <LocationOnOutlinedIcon className="h-6 w-6 text-blue-600 mr-1" aria-hidden="true" />
          {isLoading || !companyLocation
            ? "Loading location..."
            : companyLocation}
        </span>
      </div>
    </div>
  );
}
export default JobHeader;
