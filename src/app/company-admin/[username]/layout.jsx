"use client";
import SideBarContainer from "../../components/modules/company-page-author/container/SideBarContainer";
import Analytics from "../../components/modules/company-page-author/presentation/Analytics";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import React, {Suspense} from "react";
import { getCompany } from "@/app/services/companyManagment";
import CompanyAdminContent from "@/app/components/modules/company-page-author/container/CompanyAdminContent";
import { Suspense } from "react";
export default function CompanyAdminLayout({ children }) {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyAdminContent>{children}</CompanyAdminContent>
    </Suspense>
  );
}

