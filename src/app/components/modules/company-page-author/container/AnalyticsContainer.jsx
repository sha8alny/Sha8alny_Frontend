"use client";
import Analytics from "../presentation/Analytics";
import { useEffect, useState } from "react";
import { getAnalytics } from "@/app/services/companyManagement";

/**
 * AnalyticsContainer component is responsible for fetching and displaying the analytics of a company's page.
 * It retrieves the analytics data for the specified company and passes it to the Analytics component for display.
 * 
 * @param {Object} props - The props for the AnalyticsContainer component.
 * @param {string} props.companyUsername - The username of the company whose analytics are being fetched and displayed.
 * 
 * @returns {JSX.Element} The rendered AnalyticsContainer component.
 */
/**
 * Fetches the analytics data for the given company username.
 * It updates the state with the fetched analytics or sets an error if the fetch fails.
 * @async
 * @throws {Error} If the analytics fetch fails.
 */

export default function AnalyticsContainer({companyUsername}) {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const getCompanyAnalytics = async () => {
            try {
                const data = await getAnalytics(companyUsername);
                setAnalytics(data);
            } catch (err) {
                setError(err.message);
            } 
        };
        if (companyUsername) getCompanyAnalytics();
    }, [companyUsername]);

    return(
        <Analytics analytics={analytics}/>
    );
}