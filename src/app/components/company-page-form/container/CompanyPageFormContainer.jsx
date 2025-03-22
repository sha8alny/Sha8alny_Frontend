"use client";
import { useState } from "react";
import CreateCompanySectionContainer from "./CreateCompanySectionContainer";
import CompanyPreviewSectionContainer from "./CompanyPreviewSectionContainer";

function CompanyPageFormContainer() {
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyTagline, setCompanyTagline] = useState("");
  const [file, setFile] = useState(null);
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-6 min-h-screen">
      {/*Left Section*/}
      <section className="w-[55%] p-4 pt-0 rounded-lg ">
        <CreateCompanySectionContainer companyName={companyName} setcompanyName={setCompanyName} companyIndustry={companyIndustry} setcompanyIndustry={setCompanyIndustry} companyTagline={companyTagline} setcompanyTagline={setCompanyTagline} file={file} setFile={setFile}/>
      </section>
      {/*Right Section*/}
      <section className="w-[45%] p-4 rounded-lg h-fit sticky top-4">
        <CompanyPreviewSectionContainer companyName={companyName} companyTagline={companyTagline} companyIndustry={companyIndustry} file={file}/>
      </section>
    </div>
  );
}

export default CompanyPageFormContainer;