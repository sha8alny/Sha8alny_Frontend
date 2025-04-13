
"use client";

import { useRouter } from "next/navigation";
import  CompanyCardPresentation  from "../presentation/CompanyCardPresentation";
/**
 * @namespace business
 * @module business
 * 
 * @description
 * The `CompanyCardContainer` component serves as a container for the `CompanyCardPresentation` component.
 * It handles the business logic for managing user interactions, such as navigating to the company's management
 * page or viewing the company's public page, and passes the necessary props to the presentation component.
 * 
 * @param {Object} props - The props object.
 * @param {Object} props.company - The company object containing details about the company.
 * @param {string} props.company?.companyUsername - The unique username of the company used for navigation.
 * 
 * @returns {JSX.Element} The rendered `CompanyCardPresentation` component with the appropriate props.
 */
function CompanyCardContainer({ company }) {
  const router = useRouter();

  const handleManageClick = () => {
    router.push(`/company-admin/${company?.companyUsername}/company-page-author/`);
  };

  const handleViewPageClick = () => {
    router.push(`company-user-admin/${company?.companyUsername}/about-page`);
  };

  return (
    <CompanyCardPresentation
      company={company}
      onManageClick={handleManageClick}
      onViewPageClick={handleViewPageClick}
    />
  );
}

export default CompanyCardContainer;