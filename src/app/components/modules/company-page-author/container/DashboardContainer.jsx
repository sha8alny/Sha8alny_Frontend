"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCompany } from "@/app/services/companyManagement";
import Dashboard from "../presentation/Dashboard";

/**
 * DashboardContainer is a container component responsible for:
 * - Fetching company data based on the provided `username`.
 * - Handling navigation to the posts page.
 * - Passing required props to the `Dashboard` presentation component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - The username associated with the company
 * @returns {JSX.Element} The rendered Dashboard component with fetched data
 */

export default function DashboardContainer({username}){
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    /**
     * Fetch company data when the `username` changes.
     */

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

    /**
     * Redirects the user to the posts page for the company admin.
     */
    const goToPostsPage=()=>{
        router.push(`/company/${username}/admin/posts`);
    }
    return(
        <div>
            <Dashboard company={company} goToPostsPage={goToPostsPage}/>
        </div>
    );
}