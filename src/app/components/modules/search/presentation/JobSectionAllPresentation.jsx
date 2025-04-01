"use client";
import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/app/components/modules/jobs/presentation/JobsCard";
import { normalizeJob } from "@/app/utils/normalizeJob";

 const JobSectionAllPresentation = ({ jobs, isLoading, isError, onViewMore }) => {
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
              onClick={() => console.log(`Clicked on ${normalizedJob.title}`)}
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