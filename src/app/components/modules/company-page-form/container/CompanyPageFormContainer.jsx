"use client";
import { useState } from "react";
import CreateCompanySectionContainer from "./CreateCompanySectionContainer";
import CompanyPreviewSectionContainer from "./CompanyPreviewSectionContainer";

/**
 * @namespace CompanyPageFormComponents
 */

/**
 * CompanyPageFormContainer is the main container for the company creation form.
 * It consists of two sections: a form section to input company details and 
 * a preview section to display the company preview as it is being filled out.
 * The form includes fields for company name, industry, tagline, and file (for logo/cover).
 * @component
 * @returns {JSX.Element} The rendered CompanyPageFormContainer component containing the form and preview sections.
 */

export default function CompanyPageFormContainer() {
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyTagline, setCompanyTagline] = useState("");
  const [file, setFile] = useState(null);
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-6 min-h-screen">
      {/*Left Section*/}
      <section className="flex-1 p-4 pt-0 rounded-lg ">
        <CreateCompanySectionContainer companyName={companyName} setcompanyName={setCompanyName} companyIndustry={companyIndustry} setcompanyIndustry={setCompanyIndustry} companyTagline={companyTagline} setcompanyTagline={setCompanyTagline} file={file} setFile={setFile}/>
      </section>
      {/*Right Section*/}
      <section className="flex-1 lg:max-w-[40%] p-4 rounded-lg h-fit sticky top-14">
        <CompanyPreviewSectionContainer companyName={companyName} companyTagline={companyTagline} companyIndustry={companyIndustry} file={file}/>
      </section>
    </div>
  );
}