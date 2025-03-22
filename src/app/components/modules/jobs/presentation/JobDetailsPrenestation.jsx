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
    return (
        <>
            <JobHeader job={job} isLoading={isLoading} />

            {isError ? (
                <JobError errorMessage={errorMessage} />
            ) : (
                <>
                    <JobContent job={job} isLoading={isLoading} />
                    {!isLoading && <JobActions job={job} />}
                </>
            )}
        </>
    );
}

export default JobDetailsPresentation;