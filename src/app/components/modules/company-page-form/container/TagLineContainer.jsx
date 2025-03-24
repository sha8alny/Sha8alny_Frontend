"use client";
import TagLine from "../presentation/TagLine";

/**
 * TagLineContainer manages the state for the company tagline input.
 * It provides a controlled component for handling user input for the company's tagline.
 *
 * @component
 * @returns {JSX.Element} The rendered TagLineContainer component.
 */

function TagLineContainer({companyTagline, setCompanyTagline}){
    return(
        <TagLine companyTagline={companyTagline} setCompanyTagline={setCompanyTagline}/>
    );

}

export default TagLineContainer;