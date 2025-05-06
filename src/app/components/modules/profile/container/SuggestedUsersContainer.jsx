/**
 * @namespace profile
 * @module profile
 * @description Container component for displaying suggested users in profile context
 */
"use client";
import SuggestedUsers, {
  SuggestedUsersSkeleton,
} from "@/app/components/layout/SuggestedUsers";
import { useQuery } from "@tanstack/react-query";

/**
 * SuggestedUsersContainer - A flexible container for displaying suggested user lists
 * 
 * This component fetches user suggestions using the provided fetch function,
 * applies optional transformations, and handles loading/error states.
 * It supports custom relation formatting and filtering through helper functions.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display above the suggested users list
 * @param {Function} props.fetchFunction - Function to fetch user suggestions from API
 * @param {string} props.username - Username to pass to the fetch function
 * @param {Function} props.navigateTo - Function to handle navigation when a user is clicked
 * @param {Function} [props.helperFunction] - Optional function to transform or filter the data
 * @returns {JSX.Element} Rendered SuggestedUsers component or loading skeleton
 */
export default function SuggestedUsersContainer({
  title,
  fetchFunction,
  username,
  navigateTo,
  helperFunction,
}) {
  /**
   * Query to fetch suggested users with caching and refresh strategies
   * - Uses the function name as part of the cache key for proper invalidation
   * - Limits retries to prevent excessive API calls
   * - Implements a 5-minute stale time for performance optimization
   */
  const {
    data: suggestedUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [fetchFunction.name, username],
    queryFn: () => fetchFunction(username),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    if (!users || users?.length === 0) return [];
    return users.map((user) => ({
      ...user,
      relation: changeRelation(user?.connectionDegree),
    }));
  };

  if (isLoading || isError)
    return <SuggestedUsersSkeleton isLoading={isLoading}/>;

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
