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

  return (
    <SuggestedUsers title={title} users={suggestedUsers} onClick={navigateTo} />
  );
}
