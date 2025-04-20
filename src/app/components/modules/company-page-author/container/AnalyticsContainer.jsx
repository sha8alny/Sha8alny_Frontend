"use client";
import Analytics from "../presentation/Analytics";
import { useEffect, useState } from "react";
import { getCompany } from "@/app/services/companyManagement";

export default function AnalyticsContainer({username}) {
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const getAnalytics = async () => {
            try {
                const data = await getCompany(username);
                setCompany(data);
            } catch (err) {
                setError(err.message);
            } 
        };
        if (username) getAnalytics();
    }, [username]);

    return(
        <Analytics company={company}/>
    );
}