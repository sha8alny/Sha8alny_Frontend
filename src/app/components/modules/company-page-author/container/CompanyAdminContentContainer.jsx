"use client"
import CompanyAdminContent from "../presentation/CompanyAdminContent";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect} from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";


/**
 * CompanyAdminContent component that renders the admin interface
 * for a specific company. It includes a sidebar, analytics panel,
 * and conditionally rendered content based on company ownership and availability.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the main content area
 * @returns {JSX.Element} Rendered admin content page
 */

export default function CompanyAdminContentContainer({ children }) {
    const { username } = useParams();
    const searchParams = useSearchParams();
    const [logo, setLogo] = useState(searchParams.get("logo") || "");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    /**
     * Fetches company data using the `getCompany` service.
     */

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(username);
                console.log("data", data);
                if (data?.notFound || data === null || data === undefined) {  
                    setCompany("notFound");
                } 
                else if(data?.isOwner === null) {
                    setCompany("notOwner");

                }else {
                    setCompany(data);
                }
            } catch (err) {
                setCompany("notFound");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchCompany();
    }, [username]);
    
    /**
     * Updates logo state when the `logo` query param changes.
     */

    useEffect(() => {
        setLogo(searchParams.get("logo") || "");
    }, [searchParams]);
    
    /**
     * Closes sidebar and analytics when screen is resized to large.
     */

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { 
                setIsSidebarOpen(false);
                setIsAnalyticsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) setIsAnalyticsOpen(false); 
    };

    const toggleAnalytics = () => {
        setIsAnalyticsOpen(!isAnalyticsOpen);
        if (!isAnalyticsOpen) setIsSidebarOpen(false); 
    };

    const goToBusinessPage = () => {
        router.push(`/business/`);
    }

    return(
        <>
            <CompanyAdminContent
                company={company}
                setCompany={setCompany}
                username={username}
                logo={logo}
                setLogo={setLogo}
                isSidebarOpen={isSidebarOpen}
                isAnalyticsOpen={isAnalyticsOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setIsAnalyticsOpen={setIsAnalyticsOpen}
                loading={loading}
                error={error}
                children={children}
                onClick={goToBusinessPage}
                toggleSidebar={toggleSidebar}
                toggleAnalytics={toggleAnalytics}
            />
        </>
    )
}
