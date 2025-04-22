"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  followUser } from "@/app/services/connectionManagement";
import  CompanyCardPresentation  from "@/app/components/modules/search/presentation/CompanyCardPresentation";
/**
 * @namespace search
 * @module search
 */
/**
 * CompanyCardContainer is a container component that manages the logic for displaying
 * a company's card and handling user interactions such as navigation and following a company.
 *
 * @param {Object} props - The props object for the component.
 * @param {string} props.companyUsername - The unique username of the company.
 * @param {string} props.logo - The URL of the company's logo.
 * @param {string} props.industry - The industry in which the company operates.
 * @param {string} props.description - A brief description of the company.
 * @param {string} props.location - The location of the company.
 * @param {string} props.foundingDate - The founding date of the company.
 * @param {number} props.numFollowers - The number of followers the company has.
 * @param {boolean} props.isFollowed - Indicates whether the current user is following the company.
 */

 function CompanyCardContainer({
  companyId,
  companyUsername,
  logo,
  industry,
  description,
  location,
  foundingDate,
  numFollowers,
  isFollowed,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const followMutate = useMutation({
    mutationFn: () => followUser(companyUsername),
    onSuccess: () => {
      queryClient.invalidateQueries(["searchCompanies"]);
    },
  });

  const handleNavigateToCompany = () => {
    router.push(`/company/${companyUsername}/user/about`);
  };

  const handleFollowClick = () => {
    followMutate.mutate();
  };

  return (
    <CompanyCardPresentation
      companyUsername={companyUsername}
      logo={logo}
      industry={industry}
      description={description}
      location={location}
      foundingDate={foundingDate}
      numFollowers={numFollowers}
      isFollowed={isFollowed}
      onNavigateToCompany={handleNavigateToCompany}
      onFollowClick={handleFollowClick}
    />
  );
}
export default CompanyCardContainer