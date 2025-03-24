import React from 'react';
import JobHeader from './JobHeader';
import JobError from './JobError';
import JobContent from './JobContent';
import JobActions from './JobActions';
/**
 * JobDetailsPresentation component renders the details of a job.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.job - The job data to display.
 * @param {boolean} props.isLoading - Flag indicating if the job data is still loading.
 * @param {boolean} props.isError - Flag indicating if there was an error loading the job data.
 * @param {string} props.errorMessage - The error message to display if there was an error.
 *
 * @returns {JSX.Element} The rendered component.
 */

function JobDetailsPresentation({ job, isLoading, isError, errorMessage }) {
    // Handle case when job is null, undefined, or empty but not in error state
    if (isError) {
        return <JobError errorMessage={errorMessage || "An error occurred"} />;
    }

    if ((!job || Object.keys(job).length === 0) && !isLoading) {
        return <JobError errorMessage="Job information not available" />;
    }

    return (
        <>
            <JobHeader job={job || {}} isLoading={isLoading} />
            <JobContent job={job || {}} isLoading={isLoading} />
            {!isLoading && job && <JobActions job={job} />}
        </>
    );
}

export default JobDetailsPresentation;