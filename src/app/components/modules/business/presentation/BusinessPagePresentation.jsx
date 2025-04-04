
"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@/app/components/ui/Button";
import CompanyListContainer from "../container/CompanyListContainer";
/**
 * @namespace business
 * @module business
 * 
 * @description
 * The `BusinessPagePresentation` component is a presentation layer for displaying a list of companies
 * and managing pagination and company creation actions. It provides a user interface for interacting
 * with the list of companies and navigating between pages.
 * 
 * @param {Object} props - The props object.
 * @param {Array} props.companies - An array of company objects to be displayed.
 * @param {boolean} props.isLoading - A flag indicating whether the data is currently being loaded.
 * @param {boolean} props.isError - A flag indicating whether there was an error loading the data.
 * @param {Object} props.error - The error object containing details about the error, if any.
 * @param {number} props.currentPage - The current page number in the pagination.
 * @param {Function} props.onPageChange - A callback function to handle page changes.
 * @param {Function} props.onCreateCompany - A callback function to handle the creation of a new company.
 * 
 * @returns {JSX.Element} The rendered `BusinessPagePresentation` component with the appropriate UI elements.
 */
 function BusinessPagePresentation({
  companies,
  isLoading,
  isError,
  error,
  currentPage,
  onPageChange,
  onCreateCompany,
}) {
return (
    <div className="space-y-6 p-4 w-full">
        <div className="flex items-center justify-between p-4 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-text w-full sm:w-auto mb-2 sm:mb-0">
                Your Companies
            </h1>
            <Button
                onClick={onCreateCompany}
                className="text-base bg-secondary p-2 px-4 rounded-lg text-background cursor-pointer hover:bg-secondary/80 transition-colors duration-200 w-full sm:w-auto"
            >
                <Add className="mr-2" /> Create Company
            </Button>
        </div>

        <CompanyListContainer
            companies={companies}
            isLoading={isLoading}
            isError={isError}
            error={error}
        />

        <div className="flex justify-between items-center mt-4">
            <button
                className={`text-secondary p-2 rounded-md ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            <span className="text-sm text-text">Page {currentPage}</span>
            <button
                className="text-secondary p-2 rounded-md cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    </div>
);
}

export default BusinessPagePresentation;