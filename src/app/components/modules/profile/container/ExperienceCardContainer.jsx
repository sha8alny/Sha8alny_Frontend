import { ExperienceCard } from "../presentation/Experience";

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

      const month = months[date.month.toLowerCase().substring(0, 3)];
      const year = parseInt(date.year);
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

    if (years === 0) return `${months} mths`;
    if (months === 0) return `${years} yrs`;
    return `${years} yrs, ${months} mths`;

  } catch (error) {
    console.error("Error calculating date:", error, { from, to });
    return "Invalid date";
  }
}

export default function ExperienceCardContainer({job}) {
    const duration = calculateDate(job.startDate, job.endDate, job.isCurrent);
    job.endDate = job.isCurrent ? {month: "present", year: ""} : job.endDate;
    return <ExperienceCard job={job} duration={duration} />;
}
