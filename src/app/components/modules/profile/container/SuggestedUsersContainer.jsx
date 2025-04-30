/**
 * @namespace profile
 * @module profile
 */
"use client";
import SuggestedUsers, {
  SuggestedUsersSkeleton,
} from "@/app/components/layout/SuggestedUsers";
import { useQuery } from "@tanstack/react-query";

export default function SuggestedUsersContainer({
  title,
  fetchFunction,
  username,
  navigateTo,
  helperFunction,
}) {
  const {
    data: suggestedUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`suggestedUsers-${fetchFunction.name}`, username],
    queryFn: () => fetchFunction(username),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fallback to default function if helper function is not provided
  const changeRelation = (relation) => {
    switch (relation) {
      case 0:
        return "3rd+";
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return "";
    }
  };

  const changeRelations = (users) => {
    return users.map((user) => ({
      ...user,
      relation: changeRelation(user?.connectionDegree),
    }));
  };

  if (isLoading || isError)
    return <SuggestedUsersSkeleton isLoading={isLoading} title={title} />;

  if (helperFunction) {
    const filteredUsers = helperFunction(suggestedUsers);
    return (
      <SuggestedUsers
        title={title}
        users={filteredUsers}
        onClick={navigateTo}
      />
    );
  }

  const filteredUsers = changeRelations(suggestedUsers);
  return (
    <SuggestedUsers title={title} users={filteredUsers} onClick={navigateTo} />
  );
}
