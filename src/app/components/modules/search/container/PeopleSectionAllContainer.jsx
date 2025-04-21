"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { searchUser } from "@/app/services/search";
import  PeopleSectionAllPresentation  from "../presentation/PeopleSectionAllPresentation";
/**
 * @namespace search
 * @module search
 * 
 * @description
 * The `PeopleSectionAllContainer` component is a container component responsible for fetching
 * user data based on a search query and passing it to the presentation component
 * `PeopleSectionAllPresentation`. It also handles navigation to the "view more" page.
 * 
 * @param {Object} query - The query object containing search parameters.
 * @param {string} query.query - The search query string used to fetch users.
 * 
 * @returns {JSX.Element} The rendered `PeopleSectionAllPresentation` component with the fetched data.
 */
const PeopleSectionAllContainer = (query) => {
  const router = useRouter();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => searchUser(query.query, "", "", 1),
  });

  const handleViewMore = () => {
    router.push("/search/results?keyword=" + query.query + "&type=user");
  };

  return (
    <PeopleSectionAllPresentation
      users={users}
      isLoading={isLoading}
      isError={isError}
      onViewMore={handleViewMore}
      error={error?.message}
    />
  );
};

export default PeopleSectionAllContainer;
