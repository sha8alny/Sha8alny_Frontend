import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import { ExperienceCard } from "../presentation/Experience";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Calculate the duration between two dates
 * @param {object} from - The start date
 * @param {object} to - The end date
 * @param {boolean} isCurrent - Check if the end date is the current date
 * @returns {string} - The duration between the two dates
 */
function calculateDate(from, to, isCurrent = false) {
  try {
    /**
     * Converts the month and year to a date object
     * @param {object} date - The date object
     * @param {boolean} isCurrent - Check if the date is the current date
     * @returns {Date} - The date object
     */
    const parseMonthYear = (date, isCurrent = false) => {
      if (isCurrent) {
        return new Date();
      }

      // Return current date if date object is missing required properties
      if (!date?.month || !date?.year) {
        console.warn("Invalid date format:", date);
        return new Date();
      }

      const months = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
      };

      const monthStr = date.month.toLowerCase().substring(0, 3);
      const month = months[monthStr] ?? 0; // Default to January if invalid month
      const year = parseInt(date.year || new Date().getFullYear()); // Default to current year if missing
      return new Date(year, month, 1);
    };

    const fromDate = parseMonthYear(from);
    const toDate = parseMonthYear(to, isCurrent);

    let duration = toDate - fromDate;
    let years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365.25));
    let months = Math.floor(
      (duration % (1000 * 60 * 60 * 24 * 365.25)) /
        (1000 * 60 * 60 * 24 * 30.44)
    );

    // Handle negative duration (if dates are incorrect)
    if (duration < 0) {
      console.warn("Negative duration detected:", { from, to });
      return "Invalid date range";
    }

    if (years === 0) return `${months} mth(s)`;
    if (months === 0) return `${years} yr(s)`;
    return `${years} yr(s), ${months} mth(s)`;

  } catch (error) {
    console.error("Error calculating date:", error, { from, to });
    return "Invalid date";
  }
}

/**
 * Container component for displaying job experience cards.
 * Calculates the duration of the job and passes it to the ExperienceCard component.
 * Also determines if the current user is viewing their own profile.
 *
 * @param {Object} props - Component props
 * @param {Object} props.job - The job experience data to display
 * @param {Object} props.job.startDate - The start date of the job
 * @param {Object} props.job.endDate - The end date of the job, or null if current
 * @param {boolean} props.job.isCurrent - Whether this is the user's current job
 * @returns {JSX.Element} ExperienceCard component with job data, duration, and profile ownership status
 */
export default function ExperienceCardContainer({job}) {
    const { isMyProfile } = useIsMyProfile();

    const jobTypes = {
        fullTime: "Full-time",
        partTime: "Part-time",
        internship: "Internship",
        freelance: "Freelance",
        contract: "Contract",
        volunteer: "Volunteer",
        selfEmployed: "Self-employed",
        apprenticeship: "Apprenticeship",
        seasonal: "Seasonal",
    };
    
    const employmentType = jobTypes[job?.employmentType] || "Unknown";

    const duration = calculateDate(
        job?.startDate,
        job?.isCurrent ? null : job?.endDate,
        job?.isCurrent
    );
    
    const updatedJob = {
        ...job,
        employmentType: employmentType,
        endDate: job?.isCurrent ? {month: "present", year: ""} : job?.endDate
    };
    
    return <ExperienceCard job={updatedJob} duration={duration} isMyProfile={isMyProfile} />;
}
