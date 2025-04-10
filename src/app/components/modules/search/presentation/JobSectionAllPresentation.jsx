"use client";
import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/app/components/modules/jobs/presentation/JobsCard";
import { normalizeJob } from "@/app/utils/normalizeJob";
/**
 * JobSectionAllPresentation Component
 * 
 * This component is responsible for displaying a section of job listings. It handles
 * loading states, error states, and renders a list of job cards or a message if no jobs are found.
 * 
 * @namespace search
 * @module search
 * 
 * @param {Object} props - The props object.
 * @param {Array} props.jobs - An array of job objects to be displayed. Each job object is normalized before rendering.
 * @param {boolean} props.isLoading - A flag indicating whether the job data is currently loading.
 * @param {boolean} props.isError - A flag indicating whether there was an error loading the job data.
 * @param {Function} props.onViewMore - A callback function triggered when the "View all job results" button is clicked.
 * 
 * @returns {JSX.Element} The rendered JobSectionAllPresentation component.
 */

 const JobSectionAllPresentation = ({ jobs, isLoading, isError, onViewMore,handleJobClick }) => {
  if (isError) {
    return (
      <ResultsCard title="Jobs" icon={<Briefcase className="h-4 w-4" />}>
        <p className="text-gray-400 text-sm">Error loading job listings.</p>
      </ResultsCard>
    );
  }
  return (
    <ResultsCard
      title="Jobs"
      isLoading={isLoading}
      icon={<Briefcase className="h-4 w-4" />}
      viewMoreText={"View all job results"}
      onViewMore={onViewMore}
    >
      {jobs?.length > 0 ? (
        jobs.slice(0, 3).map((job, index) => {
          if (!job || Object.keys(job).length === 0) return null; 

          const normalizedJob = normalizeJob(job);
          console.log(normalizedJob);

          return (
            <JobCard
              key={normalizedJob.id || index}
              job={normalizedJob} 
              onClick={() => handleJobClick(normalizedJob.id)}
            />
          );
        })
      ) : (
        <p className="text-gray-400 text-sm">No jobs found.</p>
      )}
    </ResultsCard>
  );
};

export default JobSectionAllPresentation;