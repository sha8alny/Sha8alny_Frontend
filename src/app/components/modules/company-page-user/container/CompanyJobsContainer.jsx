"use Client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchJobListings } from "@/app/services/jobs";
import CompanyJobs from "../presentation/CompanyJobs";

/**
 * @namespace company-user
 * @module CompanyJobsContainer
 */

/**
 * Container component to fetch and display paginated job listings
 * for a specific company using React Query.
 *
 * Fetches job listings based on the provided company username.
 * Handles loading and error states and passes the data to the
 * presentational `CompanyJobs` component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - The username/identifier of the company whose jobs are being fetched
 * @returns {JSX.Element} A component that displays a list of job postings or loading/error messages
 *
 * @example
 * <CompanyJobsContainer username="exampleCompany" />
 */

export default function CompanyJobsContainer ({username}){
    const [page, setPage] = useState(1);
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["companyJobs", username, page],
        queryFn: () =>
        fetchJobListings({
            pageParam: page,
            filters: { company: username },
            itemsPerPage: 5,
        }),
        keepPreviousData: true,
        enabled: !!username, 
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load jobs.</div>;

    
    const goToJobPage = (job) => {
        router.push(`/jobs/${job._id}?title=${job.title}&company=${job.companyData?.name}`);
    };
      
    

    return(
        <div>
            <CompanyJobs jobs={data?.data || []} goToJobPage={goToJobPage}/>
        </div>
    );
}