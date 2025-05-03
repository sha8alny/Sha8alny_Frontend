"use client";
import SideBarContainer from "@/app/components/modules/company-page-author/container/SideBarContainer";
import AnalyticsContainer from "../container/AnalyticsContainer";
import { HelpCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import ClearIcon from '@mui/icons-material/Clear';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import BarChartIcon from '@mui/icons-material/BarChart';
import React from "react";

/**
 * @namespace CompanyAdminComponents
 */
/**
 * CompanyAdminContent component that displays the main content of the company admin page.
 * It includes a sidebar and an analytics section that can be toggled, as well as different states for loading or missing company data.
 * @component
 * @param {Object} company - The company object containing details of the company.
 * @param {Function} setCompany - Function to update the company data.
 * @param {string} username - The username of the company admin.
 * @param {string} logo - The logo URL or data of the company.
 * @param {Function} setLogo - Function to update the company logo.
 * @param {boolean} isSidebarOpen - State to determine if the sidebar is open or closed.
 * @param {boolean} isAnalyticsOpen - State to determine if the analytics section is open or closed.
 * @param {Function} setIsSidebarOpen - Function to toggle the sidebar's visibility.
 * @param {Function} setIsAnalyticsOpen - Function to toggle the analytics section's visibility.
 * @param {boolean} loading - A loading state to display a loading message.
 * @param {React.ReactNode} children - Any child components passed to the CompanyAdminContent.
 * @param {Function} onClick - Function to handle the "Go Back" button click.
 * @param {Function} toggleSidebar - Function to toggle the sidebar.
 * @param {Function} toggleAnalytics - Function to toggle the analytics section.
 * 
 * @returns {JSX.Element} The rendered CompanyAdminContent component.
 */

export default function CompanyAdminContent({ company,setCompany, username,logo,setLogo,isSidebarOpen, isAnalyticsOpen, setIsSidebarOpen, setIsAnalyticsOpen,loading,children, onClick, toggleSidebar, toggleAnalytics }) {

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-background text-[var(--text)]">
                <p className="text-2xl ">Loading...</p>
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
                    <Button variant="default" className="bg-secondary cursor-pointer" data-testid="companyNotFound-button" onClick={onClick}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    if (!company?.isOwner ) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-background text-text">
                <div className="mx-auto w-18 h-18 rounded-full bg-foreground flex items-center justify-center">
                    <HelpCircle className="h-12 w-12 text-zinc-400" />
                </div>
                <p className="text-2xl mt-2"> Access Denied </p>
                <p className="text-sm text-zinc-400 mt-2"> You don't have permission to access this page.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3">
                    <Button variant="default" className="bg-secondary cursor-pointer"  data-testid="NotOwner-button" onClick={onClick}>
                        Go Back
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
                    data-testid="Sidebar-button"
                >
                    {isSidebarOpen ? <ClearIcon/> : <DensityMediumIcon/>}
                </button>
                <h1 className="text-lg font-medium text-text">{company?.name}</h1>
                <button 
                    onClick={toggleAnalytics}
                    className="p-2 rounded-md text-text cursor-pointer"
                    aria-label="Toggle Analytics"
                    data-testid="Analytics-button"
                >
                    {isAnalyticsOpen ? <ClearIcon/> : <BarChartIcon/>}
                </button>
            </div>
            {/* SideBar content */}
        <div className="flex flex-1 font-sans w-full">
            <div className={`${isSidebarOpen ? "left-0 z-40 bg-opacity-50" : "hidden"} lg:relative lg:block lg:z-auto lg:bg-transparent`}>
                <div className={`w-64 md:w-69 lg:w-68 sm:w-full 2xl:w-80 min-h-screen bg-background  transition-transform duration-300 ${isSidebarOpen ? "translate-x-0 max-[639px]:w-90" : "-translate-x-full"} lg:translate-x-0 lg:shadow-none`} >
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
            <main className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
                <div className={`${isSidebarOpen ? "block sm:block hidden" : "block"}
                                ${isAnalyticsOpen ? "block sm:block hidden" : "block"}`}>
                    {children && React.cloneElement(children, { logo })}
                </div>
            </main>

            {/* Analytics*/}
            <div className={`${isAnalyticsOpen ? "right-0 z-40 bg-opacity-50" : "hidden"} lg:relative lg:block lg:z-auto lg:bg-transparent`}>
                <div className={`w-64 md:w-69 lg:w-68 sm:w-full 2xl:w-80 min-h-screen  bg-background transition-transform duration-300 ${isAnalyticsOpen ? "translate-x-0 max-[639px]:w-90" : "-translate-x-full"} lg:translate-x-0 lg:shadow-none`}>
                    <AnalyticsContainer companyUsername={username} onClose={() => setIsAnalyticsOpen(false)} />
                </div>
            </div>
        </div>
    </div>
    );
}
