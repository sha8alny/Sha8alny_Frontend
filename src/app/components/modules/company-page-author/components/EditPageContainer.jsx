"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditPage from "../presentation/EditPage";
import { updateCompany } from "@/app/services/companyManagment";


/**
 * EditPageContainer manages the state and logic for editing company details.
 * It provides input fields for company attributes and handles saving and discarding changes.
 *
 * @component
 * @returns {JSX.Element} The rendered EditPageContainer component.
 */

/**
 * @typedef {Object} CompanyData
 * @property {string} name - The company name.
 * @property {string} username - A URL-friendly version of the company name.
 * @property {string} URL - The company website URL.
 * @property {string} industry - The industry the company belongs to.
 * @property {string} description - The company's tagline or description.
 * @property {string} orgSize - The size of the company.
 * @property {string} orgType - The type of the company (e.g., private, public).
 * @property {string} logo - The company logo URL (currently empty).
 * @property {string} location - The company's physical location.
 */


function EditPageContainer(){
    const [companyName, setCompanyName] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");
    const [companyTagline, setCompanyTagline] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyURL, setCompanyURL]= useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDiscard = () => {
        setCompanyName("");
        setCompanyIndustry("");
        setCompanyTagline("");
        setCompanySize("Select size");
        setCompanyType("Select type");
        setCompanyLocation("");
        setCompanyURL("");
    }

    const handleSave=async()=>{
        try{
            setLoading(true);
            const username = companyName.toLowerCase().replace(/\s+/g, "-");

            const companyData = {
                name: companyName ,
                username :companyName.toLowerCase().replace(/\s+/g, "-") ,
                URL: companyURL,
                industry: companyIndustry ,
                description: companyTagline ,
                orgSize: companySize,
                orgType: companyType,
                logo: "", 
                location: companyLocation
            };
            await updateCompany(username, companyData);
            setCompanyName(companyName)
            handleDiscard();
        } 
        catch (err) {
            setError(err.message || "Failed to update company");
        }
        finally {
            setLoading(false); 
        }
    }

    return(
        <div>
            <EditPage companyName={companyName} setCompanyName={setCompanyName} companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} companyTagline={companyTagline} setCompanyTagline={setCompanyTagline} companySize={companySize} setCompanySize={setCompanySize} companyType={companyType} setCompanyType={setCompanyType} companyLocation={companyLocation} setCompanyLocation={setCompanyLocation}companyURL={companyURL} setCompanyURL={setCompanyURL} onSave={handleSave} onDiscard={handleDiscard} loading={loading} />
        </div>
    );
}
export default EditPageContainer;