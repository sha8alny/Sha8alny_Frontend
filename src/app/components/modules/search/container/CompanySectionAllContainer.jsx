"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { searchCompany } from "@/app/services/search";
import { CompanySectionAllPresentation } from "../presentation/CompanySectionAllPresentation";

export const CompanySectionAllContainer = (query) => {
  const {
    data: companies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchCompanies"],
    queryFn:()=> searchCompany(query.query,1),
  });

  const router = useRouter();

  const handleViewMore = () => {
    router.push("/search/companies");
  };

  return (
    <CompanySectionAllPresentation
      companies={companies}
      isLoading={isLoading}
      isError={isError}
      onViewMore={handleViewMore}
    />
  );
};