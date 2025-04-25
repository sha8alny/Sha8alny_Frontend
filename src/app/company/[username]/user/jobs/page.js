"use client";
import { useParams } from "next/navigation";
import CompanyJobsContainer from "@/app/components/modules/company-page-user/container/CompanyJobsContainer";

export default function JobsPage(){
    const { username } = useParams();
    return(
        <div>
            <CompanyJobsContainer username={username} />
        </div>
    );
}