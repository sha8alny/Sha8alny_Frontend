
/**
 * JobHeader component displays the header section of a job listing.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.job - The job data.
 * @param {string} props.job.title - The title of the job.
 * @param {Object} props.job.company_data - The company data.
 * @param {string} props.job.company_data.name - The name of the company.
 * @param {string} props.job.company_data.location - The location of the company.
 * @param {string} props.job.logo - The URL of the company's logo.
 * @param {boolean} props.isLoading - Flag indicating if the job data is still loading.
 * @returns {JSX.Element} The rendered JobHeader component.
 */
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Image from "next/image";

export default function JobHeader({ job, isLoading }) {
  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">
          {isLoading ? "Loading job title..." : job?.title}
        </h1>
        {!isLoading && (
          <div className="w-20 h-20 relative flex items-center border bg-blue-50 border-blue-200 m-2">
            {job.logo && (
              <Image
                src={job.logo}
                alt={`${job.company_data.name} logo`}
                width={48}
                height={48}
                className="object-contain rounded"
              />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-2 text-gray-700 dark:text-gray-300">
        <span className="font-medium">
          {isLoading ? "Loading company name..." : job?.company_data?.name}
        </span>
        <span className="text-gray-400">•</span>
        <span className="flex items-center">
          <LocationOnOutlinedIcon className="h-5 w-5 text-blue-600" />
          {isLoading || !job.company_data?.location ? "Loading location..." : job?.company_data?.location}
        </span>
      </div>
    </div>
  );
}
