"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followCompany } from "@/app/services/companyManagment";
import { CompanyCardPresentation } from "@/app/components/modules/search/presentation/CompanyCardPresentation";

export function CompanyCardContainer({
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
    mutationFn: () => followCompany(companyUsername),
    onSuccess: () => {
      queryClient.invalidateQueries(["searchCompanies"]);
    },
  });

  const handleNavigateToCompany = () => {
    router.push(`/company/${companyUsername}`);
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