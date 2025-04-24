"use client";
import { getCompany } from "@/app/services/companyManagement";
import CompanyFollowers from "../presentation/CompanyFollowers";
import { useEffect, useState } from "react";

/**
 * CompanyFollowersContainer is a container component that fetches company data
 * based on the given `username` prop and passes it to the `CompanyFollowers` presentation component.
 * 
 * This component is intended to be used on client-side only (via `"use client"` directive).
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.username - The username of the company to fetch data for
 * 
 * @returns {JSX.Element} A rendered `CompanyFollowers` component with the company data as a prop
 */

export default function CompanyFollowersContainer({ username }){
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
            const getFollowers = async () => {
                try {
                    const data = await getCompany(username);
                    setCompany(data);
                } catch (err) {
                    setError(err.message);
                } 
            };
            if (username) getFollowers();
        }, [username]);
    return(
        <div>
            <CompanyFollowers company={company}/>
        </div>
    );
} 