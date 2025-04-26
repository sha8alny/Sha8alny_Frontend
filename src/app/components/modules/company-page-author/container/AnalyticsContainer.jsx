"use client";
import Analytics from "../presentation/Analytics";
import { useEffect, useState } from "react";
import { getAnalytics } from "@/app/services/companyManagement";

/**
 * @namespace AnalyticsContainerComponents
 */
/**
 * AnalyticsContainer is responsible for fetching and displaying the analytics data
 * for the given company username. It handles fetching analytics data on component mount
 * and passing it to the Analytics component for rendering.
 * @component
 * @param {Object} props - The props for the AnalyticsContainer component.
 * @param {string} props.companyUsername - The username of the company whose analytics need to be fetched.
 *
 * @returns {JSX.Element} The rendered AnalyticsContainer component that includes the company analytics.
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