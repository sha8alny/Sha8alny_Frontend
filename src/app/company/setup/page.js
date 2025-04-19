"use client";
import CompanyPageFormContainer from "@/app/components/modules/company-page-form/container/CompanyPageFormContainer";

function CompanyPageForm() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-6 min-h-screen">
      <CompanyPageFormContainer/>
    </div>
  );
}

export default CompanyPageForm;
