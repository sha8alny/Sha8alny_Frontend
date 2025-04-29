"use client";
import { getCompany } from "@/app/services/companyManagement";
import CompanyFollowers from "../presentation/CompanyFollowers";
import { useEffect, useState } from "react";

/**
 * @namespace company-user
 * @module CompanyFollowersContainer
 */

/**
 * Container component that fetches and displays a company's followers data.
 * 
 * This component performs a client-side fetch of the company data using the `username` prop,
 * and passes the result to the `CompanyFollowers` presentation component.
 *
 * It manages loading state internally and only attempts to fetch data when the `username` is provided.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.username - The username/identifier of the company
 * @returns {JSX.Element} A rendered `CompanyFollowers` component with fetched company data
 *
 * @example
 * <CompanyFollowersContainer username="exampleCompany" />
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