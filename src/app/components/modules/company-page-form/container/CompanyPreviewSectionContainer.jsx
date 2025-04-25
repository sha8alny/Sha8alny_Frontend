"use client";
import { useEffect, useState } from "react";
import CompanyPreviewSection from "../presentation/CompanyPreviewSection";

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * CompanyPreviewSectionContainer handles the preview display of company details.
 * It generates a preview URL for an uploaded file (e.g., a logo) and cleans up the object URL to prevent memory leaks.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.companyName - The name of the company.
 * @param {string} props.companyTagline - The company's tagline or slogan.
 * @param {string} props.companyIndustry - The industry the company operates in.
 * @param {File} [props.file] - The uploaded file (e.g., company logo) to be previewed.
 * @returns {JSX.Element} The rendered CompanyPreviewSectionContainer component.
 */


export default function CompanyPreviewSectionContainer({companyName,companyTagline,companyIndustry,file}){
    const [preview, setPreview] = useState(null);
    useEffect(() => {
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreview(objectURL);

            return () => URL.revokeObjectURL(objectURL);
        } else {
            setPreview(null);
        }
    }, [file]);
    return(
        <div>
            <CompanyPreviewSection companyName={companyName} companyTagline={companyTagline} companyIndustry={companyIndustry} preview={preview}/>
        </div>

    );
}