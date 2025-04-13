"use client";
import SideBarContainer from "../../components/modules/company-page-author/container/SideBarContainer";
import Analytics from "../../components/modules/company-page-author/presentation/Analytics";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import React, { Suspense } from "react";
import { getCompany } from "@/app/services/companyManagement";
import CompanyAdminContent from "@/app/components/modules/company-page-author/container/CompanyAdminContent";
export default function CompanyAdminLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col md:flex-row w-full h-full justify-center">
        <CompanyAdminContent>{children}</CompanyAdminContent>
      </div>
    </Suspense>
  );
}
