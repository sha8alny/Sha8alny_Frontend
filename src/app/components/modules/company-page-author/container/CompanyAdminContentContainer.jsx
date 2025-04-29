"use client"
import CompanyAdminContent from "../presentation/CompanyAdminContent";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect} from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { getCompany } from "@/app/services/companyManagement";

/**
 * @namespace CompanyAdminContentContainerComponents
 */

/**
 * CompanyAdminContentContainer is responsible for managing the state and fetching company data
 * for the given username. It also handles resizing events and provides functions to toggle the
 * sidebar and analytics sections.
 * @component
 * @param {Object} props - The props for the CompanyAdminContentContainer component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the container.
 *
 * @returns {JSX.Element} The rendered CompanyAdminContentContainer component that includes the company
 * data and handles sidebar/analytics toggling and navigation.
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



    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(username);
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
    

    useEffect(() => {
        setLogo(searchParams.get("logo") || "");
    }, [searchParams]);


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
