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
 * `CompanyAdminContent` is a React functional component that displays a company's admin page.
 * It includes dynamic loading states, error handling, and toggles for sidebar and analytics components.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.company - The company object or a string that represents the company's state.
 * @param {Function} props.setCompany - A function to update the company state.
 * @param {string} props.username - The username of the logged-in user.
 * @param {string} props.logo - The logo URL or the company logo.
 * @param {Function} props.setLogo - A function to update the logo state.
 * @param {boolean} props.isSidebarOpen - A boolean indicating whether the sidebar is open.
 * @param {boolean} props.isAnalyticsOpen - A boolean indicating whether the analytics view is open.
 * @param {Function} props.setIsSidebarOpen - A function to toggle the sidebar open state.
 * @param {Function} props.setIsAnalyticsOpen - A function to toggle the analytics view state.
 * @param {boolean} props.loading - A boolean indicating whether the component is in a loading state.
 * @param {ReactNode} props.children - The children to render inside the main content area.
 * @param {Function} props.onClick - A function to handle the "Go Back" button click.
 * @param {Function} props.toggleSidebar - A function to toggle the sidebar visibility.
 * @param {Function} props.toggleAnalytics - A function to toggle the analytics visibility.
 * 
 * @returns {JSX.Element} - The rendered JSX for the company admin page.
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
                    <Button variant="default" className="bg-secondary cursor-pointer" onClick={onClick}>
                        Go Back
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
                    {isSidebarOpen ? <ClearIcon/> : <DensityMediumIcon/>}
                </button>
                <h1 className="text-lg font-medium text-text">{company?.name}</h1>
                <button 
                    onClick={toggleAnalytics}
                    className="p-2 rounded-md text-text cursor-pointer"
                    aria-label="Toggle Analytics"
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
