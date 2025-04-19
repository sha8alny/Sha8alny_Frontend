"use client";
import SideBarContainer from "@/app/components/modules/company-page-author/container/SideBarContainer";
import Analytics from "@/app/components/modules/company-page-author/presentation/Analytics";
import { HelpCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import React from "react";

export default function CompanyAdminContent({ company,setCompany, username,logo,setLogo,isSidebarOpen, isAnalyticsOpen, setIsSidebarOpen, setIsAnalyticsOpen,loading,error,children, onClick}) {
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) setIsAnalyticsOpen(false); 
    };

    const toggleAnalytics = () => {
        setIsAnalyticsOpen(!isAnalyticsOpen);
        if (!isAnalyticsOpen) setIsSidebarOpen(false); 
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-background text-[var(--text)]">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (company === "notFound") {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-background text-text">
                <div className="mx-auto w-18 h-18 rounded-full bg-foreground flex items-center justify-center">
                    <HelpCircle className="h-12 w-12 text-zinc-400" />
                </div>
                <p className="text-2xl mt-2"> This Shaغalny Page isn't available </p>
                <p className="text-sm text-zinc-400 mt-2"> The Page you are searching for is no longer exist </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3">
                    <Button variant="default" className="bg-secondary cursor-pointer" onClick={onClick}>
                        Go Back
                    </Button>
                    <Button variant="outline" className="border-foreground text-text cursor-pointer">
                        Contact Support
                    </Button>
                </div>
            </div>
        );
    }

    if (company === "notOwner") {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-background text-white">
                <div className="mx-auto w-18 h-18 rounded-full bg-foreground flex items-center justify-center">
                    <HelpCircle className="h-12 w-12 text-zinc-400" />
                </div>
                <p className="text-2xl mt-2"> Access Denied </p>
                <p className="text-sm text-zinc-400 mt-2"> You don't have permission to access this page.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3">
                    <Button variant="default" className="bg-secondary cursor-pointer" onClick={onClick}>
                        Go Back
                    </Button>
                    <Button variant="outline" className="border-foreground text-text cursor-pointer">
                        Contact Support
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen mx-16 min-w-[80%]">
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
                <div className={`${isSidebarOpen ? " z-40 bg-opacity-50" : "hidden"}  lg:bg-transparent lg:static lg:block lg:z-auto`}>
                    <div className={`w-full 2xl:w-100 h-full bg-background shadow-lg transition-transform duration-300
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:shadow-none `}>
                        <SideBarContainer 
                            company={company}
                            setCompany={setCompany}
                            username={username} 
                            logo={logo} 
                            setLogo={setLogo} 
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>
                
                {/* Main content */}
                <main className="flex-1 overflow-auto lg:px-4 p-4 md:p-6 flex flex-col">
                    {children && React.cloneElement(children, { logo })}
                </main>
                
                {/* Analytics*/}
                <div className={`${isAnalyticsOpen ? " z-40  bg-opacity-50" : "hidden"} lg:bg-transparent lg:static lg:block lg:z-auto `}>
                    <div className={`w-80 2xl:w-100 min-h-screen shadow-lg  transition-transform duration-300
                        ${isAnalyticsOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 lg:shadow-none `}>
                        <Analytics onClose={() => setIsAnalyticsOpen(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
