"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateCompanySection from "../presentation/CreateCompanySection";
import { createCompany } from "@/app/services/companyManagement";

/**
 * @namespace company-page-form
 * @module company-page-form
 */
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


export default function CreateCompanySectionContainer({companyName, setcompanyName,companyIndustry,setcompanyIndustry,companyTagline,setcompanyTagline,file,setFile}){
    const [companyUsername, setCompanyUsername] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [companyDate, setCompanyDate] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [showerror, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const router = useRouter(); 

    const isFormValid = companyName.trim() !== "" || companyIndustry.trim() !== "" ||
                        companySize.trim() !== "" || companyType.trim() !== "" ||
                        companyLocation.trim() !== ""||
                        companyDate.trim() !== ""; 

    const handleInputChange = (field, value) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: value.trim() ? "" : `${field} is required`,
        }));
    };
    const checkBox = () => {
        setIsChecked((prev) => {
            const newChecked = !prev;
            setShowError(!newChecked);
            setErrors((prevErrors) => ({
                ...prevErrors,
                terms: newChecked ? "" : "You must agree to the terms.",
            }));
            return newChecked;
        });
    };
    
    const handleSubmit = async () => {
        let newErrors={};
        if (!companyName.trim()) newErrors.companyName = "Company name is required";
        if (!companyIndustry.trim()) newErrors.companyIndustry = "Industry is required";
        if (!companySize.trim()) newErrors.companySize = "Company size is required";
        if (!companyType.trim()) newErrors.companyType = "Company type is required";
        if (!companyLocation.trim()) newErrors.companyLocation = "Location is required";
        if (!companyUsername.trim()) newErrors.companyUsername = "Username is required";
        if (!companyDate.trim()) newErrors.companyDate = "Founding date is required";
        if (!isChecked) newErrors.terms = "You must agree to the terms.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setError(null);
        setErrors({}); 

        try {
            const companyData = new FormData();
            companyData.append("name", companyName);
            companyData.append("username", companyUsername);
            if(companyWebsite) companyData.append("URL", companyWebsite);
            companyData.append("orgSize", companySize);
            companyData.append("orgType", companyType);
            if(companyTagline) companyData.append("tagline", companyTagline);
            companyData.append("industry", companyIndustry);
            companyData.append("location", companyLocation);
            if(companyPhone)companyData.append("phoneNumber", companyPhone);
            companyData.append("foundingDate", companyDate);
            if (file) {
                companyData.append("logo", file);
            }
            const response = await createCompany(companyData);
            router.push(`/company/${companyUsername}/admin/dashboard`);
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
        companyUsername={companyUsername} setCompanyUsername={(value)=>{setCompanyUsername(value);handleInputChange("username", value);}}
        companyDate={companyDate} setCompanyDate ={(value)=>{setCompanyDate(value);handleInputChange("companyDate", value);}}
        companyPhone={companyPhone} setCompanyPhone= {(value)=>{setCompanyPhone(value);handleInputChange("companyPhone", value);}}
        onCreateCompany={handleSubmit} loading={loading} isFormValid={isFormValid} errors={errors} setErrors={setErrors}
        isChecked={isChecked} checkBox={checkBox} error={error}/>
    );

}