"use client"
import React, { Suspense } from "react";
import SideBarContainer from "@/app/components/modules/company-page-author/container/SideBarContainer";
import Analytics from "@/app/components/modules/company-page-author/presentation/Analytics";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCompany } from "@/app/services/companyManagment";

export default function CompanyAdminContent({ children }) {
    const { username } = useParams();
    const searchParams = useSearchParams();
    const [logo, setLogo] = useState(searchParams.get("logo") || "");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

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

    return (
        <div className="flex flex-col h-screen">
            <div className="lg:hidden flex justify-between items-center px-4 py-2 bg-background border-b">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-text cursor-pointer"
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarOpen ? "✕" : "☰"}
                </button>
                <h1 className="text-lg font-medium text-text">{company?.name}</h1>
                <button 
                    onClick={toggleAnalytics}
                    className="p-2 rounded-md text-text cursor-pointer"
                    aria-label="Toggle Analytics"
                >
                    {isAnalyticsOpen ? "✕" : "📊"}
                </button>
            </div>
            {/* SideBar content */}
            <div className="flex flex-1 font-sans">
                <div className={`
                    ${isSidebarOpen ? " z-40 bg-opacity-50" : "hidden"} 
                    lg:bg-transparent lg:static lg:block lg:z-auto
                `}>
                    <div className={`
                        w-full h-full bg-background shadow-lg transition-transform duration-300
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                        lg:translate-x-0 lg:shadow-none
                    `}>
                        <SideBarContainer 
                            company={company}
                            username={username} 
                            logo={logo} 
                            setLogo={setLogo} 
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>
                
                {/* Main content */}
                <main className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
                    {children && React.cloneElement(children, { logo })}
                </main>
                
                {/* Analytics*/}
                <div className={`
                    ${isAnalyticsOpen ? " z-40  bg-opacity-50" : "hidden"}
                    lg:bg-transparent lg:static lg:block lg:z-auto
                `}>
                    <div className={`
                        w-80 min-h-screen shadow-lg  transition-transform duration-300
                        ${isAnalyticsOpen ? "translate-x-0" : "translate-x-full"}
                        lg:translate-x-0 lg:shadow-none
                    `}>
                        <Analytics onClose={() => setIsAnalyticsOpen(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
