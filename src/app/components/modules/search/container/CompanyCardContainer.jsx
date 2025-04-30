"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unFollowUser } from "@/app/services/connectionManagement";
import CompanyCardPresentation from "@/app/components/modules/search/presentation/CompanyCardPresentation";
import { useState, useEffect } from "react";

/**
 * @namespace search
 * @module search
 */
/**
 * CompanyCardContainer is a container component that manages the logic for displaying
 * a company's card and handling user interactions such as navigation and following a company.
 * Implements optimistic updates for follow state and follower count.
 *
 * @param {Object} props - The props object for the component.
 * @param {string} props.companyId - The unique ID of the company.
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
  name,
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
  
  const [optimisticIsFollowed, setOptimisticIsFollowed] = useState(isFollowed);
  const [optimisticNumFollowers, setOptimisticNumFollowers] = useState(numFollowers);
  
  useEffect(() => {
    setOptimisticIsFollowed(isFollowed);
    setOptimisticNumFollowers(numFollowers);
  }, [isFollowed, numFollowers]);

  const toggleFollowMutation = useMutation({
    mutationFn: () => {
      return !optimisticIsFollowed
        ? unFollowUser(companyUsername)
        : followUser(companyUsername);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ["searchCompanies"]});
      
      const previousData = queryClient.getQueryData(["searchCompanies"]);
      
      setOptimisticIsFollowed(!optimisticIsFollowed);
      setOptimisticNumFollowers(
        optimisticIsFollowed
        ? optimisticNumFollowers - 1
        : optimisticNumFollowers + 1
      );
      
      if (previousData?.pages) {
        const updatedPages = previousData.pages.map(page => {
          console.log("prev data",previousData)
          return {
            ...page,
            companies: page.companies.map(company => {
              if (company.companyUsername === companyUsername) {
                return {
                  ...company,
                  isFollowed: !optimisticIsFollowed,
                  numFollowers: optimisticIsFollowed 
                    ? company.numFollowers - 1 
                    : company.numFollowers + 1
                };
              }
              return company;
            })
          };
        });
        
        queryClient.setQueryData(["searchCompanies"], {
          ...previousData,
          pages: updatedPages
        });
      }
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      setOptimisticIsFollowed(isFollowed);
      setOptimisticNumFollowers(numFollowers);
      
      if (context.previousData) {
        queryClient.setQueryData(["searchCompanies"], context.previousData);
      }
    },
    onSettled: () => {
      // queryClient.invalidateQueries(["searchCompanies"]);
    },
  });

  const handleNavigateToCompany = () => {
    router.push(`/company/${companyUsername}/user/about`);
  };

  const handleFollowClick = (e) => {
    e?.stopPropagation();
    toggleFollowMutation.mutate();
  };

  return (
    <CompanyCardPresentation
      companyUsername={companyUsername}
      name={name}
      logo={logo}
      industry={industry}
      description={description}
      location={location}
      foundingDate={foundingDate}
      numFollowers={optimisticNumFollowers}
      isFollowed={optimisticIsFollowed}
      onNavigateToCompany={handleNavigateToCompany}
      onFollowClick={handleFollowClick}
    />
  );
}

export default CompanyCardContainer;