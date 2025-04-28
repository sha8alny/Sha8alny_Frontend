"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCompany } from "@/app/services/companyManagement";
import Dashboard from "../presentation/Dashboard";

/**
 * @namespace DashboardContainerComponents
 */
/**
 * DashboardContainer component is responsible for fetching the company data using the `username` prop
 * and passing the data to the `Dashboard` component. It also provides functionality for navigating
 * to the posts page.
 * @component
 * @param {Object} props - The props for the DashboardContainer component.
 * @param {string} props.username - The username of the company whose dashboard is to be displayed.
 * 
 * @returns {JSX.Element} The rendered DashboardContainer component that includes company data
 * and a button to navigate to the posts page.
 */

export default function DashboardContainer({username}){
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(username);
                setCompany(data);
            } catch (err) {
                setError(err.message);
            } 
        };

        if (username) fetchCompany();
    }, [username]);


    const goToPostsPage=()=>{
        router.push(`/company/${username}/admin/posts`);
    }
    return(
        <div>
            <Dashboard company={company} goToPostsPage={goToPostsPage}/>
        </div>
    );
}