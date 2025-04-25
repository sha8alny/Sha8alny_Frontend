"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditPage from "../presentation/EditPage";
import { updateCompany } from "@/app/services/companyManagement";

/**
 * @namespace EditPageComponents
 */
/**
 * EditPageContainer component manages the state for editing company details.
 * It allows users to update various company attributes, including name, industry, tagline, and more.
 * After saving the changes, the component submits the data and redirects to the company edit page.
 * @component
 * @param {Object} props - The props for the EditPageContainer component.
 * @param {string} props.username - The username of the company to be edited.
 * 
 * @returns {JSX.Element} The rendered EditPageContainer component.
 */

export default function EditPageContainer({username}){
    const [companyName, setCompanyName] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");
    const [companyTagline, setCompanyTagline] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [companyUsername, setCompanyUsername]= useState("");
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
        setCompanyUsername("");
        setCompanyWebsite("");
        setCompanyDate("");
        setCompanyPhone("");
        setCompanyDescription("");
    }

    
    const handleSave = async()=>{
        setLoading(true);
        const companyData = new FormData();
        if (companyName) companyData.append("name", companyName);
        if (companyUsername) companyData.append("username", companyUsername);
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
            const updatedUsername = companyUsername || username;
            const response = await updateCompany(username, companyData);
            handleDiscard();
            router.push(`/company/${updatedUsername}/admin/edit`);
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
            companyUsername={companyUsername} setCompanyUsername={setCompanyUsername} 
            companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} 
            companyDate={companyDate} setCompanyDate={setCompanyDate} 
            companyPhone={companyPhone} setCompanyPhone={setCompanyPhone}
            companyDescription={companyDescription} setCompanyDescription={setCompanyDescription}
            onSave={handleSave} onDiscard={handleDiscard} loading={loading}
            errors={errors} setErrors={setErrors} />
        </div>
    );
}