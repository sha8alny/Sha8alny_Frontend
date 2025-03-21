"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateCompanySection from "../presentation/CreateCompanySection";
import { createCompany } from "@/app/services/companyManagment";

/**
 * CreateCompanySectionContainer manages the state and logic for creating a new company.
 * It handles form validation, input changes, and submission while interacting with the `CreateCompanySection` component.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.companyName - The name of the company.
 * @param {Function} props.setcompanyName - Function to update the company name state.
 * @param {string} props.companyIndustry - The industry of the company.
 * @param {Function} props.setcompanyIndustry - Function to update the company industry state.
 * @param {string} props.companyTagline - The tagline or description of the company.
 * @param {Function} props.setcompanyTagline - Function to update the company tagline state.
 * @param {File|null} props.file - The uploaded file (e.g., company logo).
 * @param {Function} props.setFile - Function to update the uploaded file state.
 * @returns {JSX.Element} The rendered CreateCompanySectionContainer component.
 */


function CreateCompanySectionContainer({companyName, setcompanyName,companyIndustry,setcompanyIndustry,companyTagline,setcompanyTagline,file,setFile}){
    const [companyURL, setCompanyURL] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const router = useRouter(); 

    const isFormValid = companyName.trim() !== "" || companyIndustry.trim() !== "" ||
                        companySize.trim() !== "" || companyType.trim() !== "" ||
                        companyLocation.trim() !== "";

    const handleInputChange = (field, value) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: "", // Clear error when user types
        }));
    };

    const handleSubmit = async () => {
        let newErrors={};
        if (!companyName.trim()) newErrors.companyName = "Company name is required";
        if (!companyIndustry.trim()) newErrors.companyIndustry = "Industry is required";
        if (!companySize.trim()) newErrors.companySize = "Company size is required";
        if (!companyType.trim()) newErrors.companyType = "Company type is required";
        if (!companyLocation.trim()) newErrors.companyLocation = "Location is required";
        if (!companyURL.trim()) newErrors.companyURL = "URL is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; 
        }

        setLoading(true);
        setError(null);
        setErrors({}); 

        const companyData = {
            username: companyName.toLowerCase().replace(/\s+/g, "-"),
            name: companyName,
            URL: companyURL, 
            orgSize: companySize,
            orgType: companyType, 
            logo: file ? URL.createObjectURL(file) : null, 
            cover: null, 
            description: companyTagline,
            industry: companyIndustry,
            location: companyLocation,
        };

        try {
            await createCompany(companyData);
            setcompanyName("");
            setcompanyIndustry("");
            setcompanyTagline("");
            setFile(null);
            setCompanySize("Select size");
            setCompanyType("Select type");
            setCompanyLocation("");
            router.push(`/company-page-author/${companyData.username}`);
        } catch (err) {
            setError(err.message || "Failed to create company");
        } finally {
            setLoading(false);
        }
    };
    
    return(
        <CreateCompanySection 
        companyName={companyName} setCompanyName={(value)=>{setcompanyName(value);handleInputChange("companyName", value);}} 
        companyIndustry={companyIndustry} setCompanyIndustry={(value)=>{setcompanyIndustry(value); handleInputChange("companyIndustry", value);}} 
        companyTagline={companyTagline} setCompanyTagline={(value)=>{setcompanyTagline(value); handleInputChange("companyTagline", value);}} 
        file={file} setFile={setFile} 
        companySize={companySize} setCompanySize={(value)=>{setCompanySize(value);handleInputChange("companySize", value);}} 
        companyType={companyType} setCompanyType={(value)=>{setCompanyType(value);handleInputChange("companyType", value);}} 
        companyLocation={companyLocation} setCompanyLocation={(value)=>{setCompanyLocation(value);handleInputChange("companyLocation", value);}} 
        companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite}
        companyURL={companyURL} setCompanyURL={(value)=>{setCompanyURL(value);handleInputChange("companyURL", value);}} 
        onCreateCompany={handleSubmit} loading={loading} isFormValid={isFormValid} errors={errors} setErrors={setErrors}/>
    );

}

export default CreateCompanySectionContainer;