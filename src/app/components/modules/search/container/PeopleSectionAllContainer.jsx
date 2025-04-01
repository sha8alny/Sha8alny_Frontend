"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { searchUser } from "@/app/services/search";
import { PeopleSectionAllPresentation } from "../presentation/PeopleSectionAllPresentation";

const PeopleSectionAllContainer = (query) => {
  const router = useRouter();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => searchUser(query.query, "", "", 1),
  });

  const handleViewMore = () => {
    router.push("/search/people");
  };

  return (
    <PeopleSectionAllPresentation
      users={users}
      isLoading={isLoading}
      isError={isError}
      onViewMore={handleViewMore}
    />
  );
};

export default PeopleSectionAllContainer;
