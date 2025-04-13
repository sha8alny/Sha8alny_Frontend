"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCompany } from "@/app/services/companyManagement";
import Dashboard from "../presentation/Dashboard";

export default function DashboardContainer({username}){
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCompany = async () => {
        try {
            const data = await getCompany(username);
            console.log("Fetched company:", data); 
            setCompany(data);
        } catch (err) {
            setError(err.message);
        } 
        };

        if (username) fetchCompany();
    }, [username]);
    
    const router = useRouter();
    const goToPostsPage=()=>{
        router.push(`/company-admin/${username}/posts-page`);
    }
    return(
        <div>
            <Dashboard company={company} goToPostsPage={goToPostsPage}/>
        </div>
    );
}