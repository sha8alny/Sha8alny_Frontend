"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditPage from "../presentation/EditPage";
import { updateCompany } from "@/app/services/companyManagement";
import { Tag } from "@mui/icons-material";


/**
 * @namespace company-page-author
 * @module company-page-author
 */
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


function EditPageContainer({username}){
    const [companyName, setCompanyName] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");
    const [companyTagline, setCompanyTagline] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [companyURL, setCompanyURL]= useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [companyDate, setCompanyDate] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter(); 

    const handleDiscard = () => {
        setCompanyName("");
        setCompanyIndustry("");
        setCompanyTagline("");
        setCompanySize("");
        setCompanyType("");
        setCompanyLocation("");
        setCompanyURL("");
        setCompanyWebsite("");
        setCompanyDate("");
        setCompanyPhone("");
        setCompanyDescription("");
    }

    
    const handleSave = async()=>{
        setLoading(true);
        const companyData = new FormData();
        if (companyName) companyData.append("name", companyName);
        if (companyURL) companyData.append("username", companyURL);
        if (companyWebsite) companyData.append("URL", companyWebsite);
        if (companySize) companyData.append("orgSize", companySize);
        if (companyType) companyData.append("orgType", companyType);
        if (companyTagline) companyData.append("tagline", companyTagline);
        if (companyDescription) companyData.append("description", companyDescription);
        if (companyIndustry) companyData.append("industry", companyIndustry);
        if (companyLocation) companyData.append("location", companyLocation);
        if (companyPhone) companyData.append("phoneNumber", companyPhone);
        if (companyDate) companyData.append("foundingDate", companyDate);
        try{
            const updatedUsername = companyURL || username;
            const response = await updateCompany(username, companyData);
            handleDiscard();
            router.push(`/company-admin/${updatedUsername}/edit-page`);
        } 
        catch (err) {
            setErrors({ api: err.message || "Failed to update company" })
        }
        finally {
            setLoading(false); 
        }
    }

    return(
        <div>
            <EditPage 
            companyName={companyName} setCompanyName={setCompanyName} 
            companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry} 
            companyTagline={companyTagline} setCompanyTagline={setCompanyTagline} 
            companySize={companySize} setCompanySize={setCompanySize} 
            companyType={companyType} setCompanyType={setCompanyType} 
            companyLocation={companyLocation} setCompanyLocation={setCompanyLocation}
            companyURL={companyURL} setCompanyURL={setCompanyURL} 
            companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} 
            companyDate={companyDate} setCompanyDate={setCompanyDate} 
            companyPhone={companyPhone} setCompanyPhone={setCompanyPhone}
            companyDescription={companyDescription} setCompanyDescription={setCompanyDescription}
            onSave={handleSave} onDiscard={handleDiscard} loading={loading}
            errors={errors} setErrors={setErrors} />
        </div>
    );
}
export default EditPageContainer;