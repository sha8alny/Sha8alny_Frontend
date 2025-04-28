import Container from "@/app/components/layout/Container";

/**
 * @namespace CompanyProfile
 * @description Namespace for components and types related to the company profile section.
 */

/**
 * @typedef {Object} Company
 * @property {string} [description] - A short description or overview of the company.
 * @property {string} [URL] - The company's website URL.
 * @property {string} [industry] - The industry the company operates in.
 * @property {string} [location] - The headquarters or main location of the company.
 * @property {string} [orgSize] - The size of the organization (e.g., "11-50 employees").
 * @property {string} [orgType] - The type of organization (e.g., "Public", "Private").
 * @property {string} [foundingDate] - The ISO date string of when the company was founded.
 */

/**
 * About component - Displays detailed information about a company in a styled container.
 *
 * @memberof CompanyProfile
 * @component
 * @param {Object} props - Component props.
 * @param {Company} props.company - The company object containing various details.
 * @param {Function} props.goToCompanyPage - Function to handle navigation to the company's website.
 *
 * @returns {JSX.Element} A rendered container showing the company's details.
 */

export default function About({company,goToCompanyPage}){
    return(
        <Container className="border-[#111] border shadow-lg">
            <div className="h-max rounded-xl p-6 space-y-2">
                <div>
                    <h1 className="text-xl font-bold">Overview</h1>
                    <p className="text-muted">{company?.description || "No description provided."}</p>
                </div>
                <div onClick={goToCompanyPage}>
                    <h2 className="font-bold">Website</h2>
                    <p className="text-[var(--secondary)] hover:underline cursor-pointer">{company?.URL || "Not provided"}</p>
                </div>
                <div>
                    <h2 className="font-bold">Industry</h2>
                    <p className="text-muted">{company?.industry || "N/A"}</p>
                </div>
                <div>
                    <h2 className="font-bold">Location</h2>
                    <p className="text-muted">{company?.location || "N/A"}</p>
                </div>
                <div>
                    <h2 className="font-bold">Company size</h2>
                    <p className="text-muted">{company?.orgSize || "N/A"}</p>
                </div>
                <div>
                    <h2 className="font-bold">Company type</h2>
                    <p className="text-muted">{company?.orgType || "N/A"}</p>
                </div>
                <div>
                    <h2 className="font-bold">Founded</h2>
                    <p className="text-muted">{company?.foundingDate ? new Date(company.foundingDate).getFullYear() : "N/A"}</p>
                </div>
            </div>
        </Container>
        
    );
}
