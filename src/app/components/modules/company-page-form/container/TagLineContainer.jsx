"use client";
import TagLine from "../presentation/TagLine";

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * TagLineContainer manages the state for the company tagline input.
 * It provides a controlled component for handling user input for the company's tagline.
 *
 * @component
 * @returns {JSX.Element} The rendered TagLineContainer component.
 */

export default function TagLineContainer({companyTagline, setCompanyTagline,companyDescription, setCompanyDescription, isEditing=false}){    
    return(
        <>
            <TagLine label="Tagline" maxLength={120} id = "company-tagline"  name= "company-tagline" placeholder="ex:An information services firm helping small businesses succeed" value={companyTagline} onChange={setCompanyTagline} isEditing={isEditing} isFirstTagline={true}/>

            {isEditing && (<TagLine label="Overview" maxLength={2000} id = "company-overview"  name= "company-overview" placeholder="Add an About Us with a brief overview of your products and services" value={companyDescription} onChange={setCompanyDescription} isFirstTagline={false}/>)}
        </>
    );

}