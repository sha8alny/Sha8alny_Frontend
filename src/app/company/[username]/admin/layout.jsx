"use client";
import React, { Suspense } from "react";
import CompanyAdminContentContainer from "@/app/components/modules/company-page-author/container/CompanyAdminContentContainer";
export default function CompanyAdminLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col md:flex-row w-full h-full justify-center">
        <CompanyAdminContentContainer>{children}</CompanyAdminContentContainer>
      </div>
    </Suspense>
  );
}
