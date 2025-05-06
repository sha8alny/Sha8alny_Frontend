import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Dialog from "@/app/components/ui/DialogMod";
import { fetchUserConnections } from "@/app/services/userProfile";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useIsMyProfile } from "@/app/context/IsMyProfileContext";
import ConnectionsPresentation, {
  ConnectionsCard,
} from "../presentation/ConnectionsPresentation";
import { useState } from "react";
import { blockUser } from "@/app/services/privacy";
import { removeConnection } from "@/app/services/connectionManagement";
import { useToast } from "@/app/context/ToastContext";


/**
 * @namespace profile
 * @module profile
 */
/**
 * Connections component - Displays a user's connections in a dialog
 *
 * This component fetches and displays a paginated list of a user's connections.
 * It includes infinite scrolling functionality to load more connections as the
 * user scrolls through the list.
 *
 * @param {Object} props - Component props
 * @param {Object} props.userInfo - Information about the user whose connections to display
 * @param {string} props.userInfo.username - Username of the user
 * @param {number} props.userInfo.connectionsCount - Count of user's connections
 * @returns {JSX.Element} Dialog component with connections list
 */
export default function Connections({ userInfo }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const observerTarget = useRef(null);
  const router = useRouter();
  const { isMyProfile } = useIsMyProfile();

  // Fetch connections with infinite query for pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["connections", userInfo?.username],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserConnections(
        pageParam,
        10,
        userInfo?.username !== undefined ? userInfo.username : null
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.length || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  /**
   * Navigate to specified path using Next.js router
   * @param {string} path - The path to navigate to
   */
  const navigateTo = (path) => {
    router.push(path);
  };

  /**
   * Set up intersection observer for infinite scrolling
   * This effect creates an observer that triggers loading more connections
   * when the user scrolls to the bottom of the list
   */
  useEffect(() => {
    if (!isDialogOpen) return;

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("Intersection detected, loading more...");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) observer.observe(currentTarget);

      return () => {
        if (currentTarget) observer.unobserve(currentTarget);
        clearTimeout(timer);
      };
    }, 300); // Small delay to ensure dialog is rendered

    return () => clearTimeout(timer);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isDialogOpen]);

  const connections = data?.pages.flatMap((page) => page) || [];

  /**
   * Format the connection date to a relative time string
   * @param {string} dateString - ISO date string for when the connection was formed
   * @returns {string} Formatted string (e.g., "Connected today", "Connected 2 weeks ago")
   */
  const formatConnectedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const startOfNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const diffTime = startOfNow - startOfDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Connected today";
    } else if (diffDays === 1) {
      return "Connected yesterday";
    } else if (diffDays < 7) {
      return `Connected ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Connected ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Connected ${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `Connected ${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  /**
   * Convert numeric connection degree to string representation
   * @param {number} relation - Connection degree (0-3)
   * @returns {string} String representation of connection degree (1st, 2nd, etc.)
   */
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
    }
  };

  // Process connections to add formatted date and relation text
  const allConnections = [...connections].map((connection) => ({
    ...connection,
    connectedAt: formatConnectedDate(connection?.connectedAt),
    relation: changeRelation(connection?.connectionDegree),
  }));

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      useRegularButton
      buttonData={
        (userInfo?.connectionsCount >= 500
          ? "500+"
          : userInfo?.connectionsCount) + " connection(s)"
      }
      buttonClass="hover:underline cursor-pointer text-secondary self-start text-sm"
      testId="connections"
      AlertContent={
        <ConnectionsPresentation
          connections={allConnections}
          isMyProfile={isMyProfile}
          navigateTo={navigateTo}
          userInfo={userInfo}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          observerTarget={observerTarget}
        />
      }
    />
  );
}

/**
 * ConnectionsCardContainer - Container component for individual connection cards
 *
 * This component handles the logic for connection-related actions like blocking
 * users and removing connections.
 *
 * @param {Object} props - Component props
 * @param {Object} props.connection - Connection data to display
 * @param {string} props.connection.username - Username of the connection
 * @param {Function} props.navigateTo - Function to navigate to a different page
 * @param {boolean} props.isMyProfile - Whether this is the current user's profile
 * @returns {JSX.Element} Connection card with action handlers
 */
export const ConnectionsCardContainer = ({
  connection,
  navigateTo,
  isMyProfile,
}) => {
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [removeConnectionModalOpen, setRemoveConnectionModalOpen] =
    useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  /**
   * Handle blocking a user
   * Triggers the block user mutation
   */
  const handleBlock = () => {
    handleBlockMutation.mutate(connection?.username);
  };

  /**
   * Handle removing a connection
   * Triggers the remove connection mutation
   */
  const handleRemoveConnection = () => {
    handleDeleteMutation.mutate(connection?.username);
  };

  // Mutation for blocking a user
  const handleBlockMutation = useMutation({
    mutationFn: (username) => blockUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile"]);
      toast("User blocked successfully", true);
      setBlockModalOpen(false);
    },
  });

  // Mutation for removing a connection
  const handleDeleteMutation = useMutation({
    mutationFn: (username) => removeConnection(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile"]);
      setRemoveConnectionModalOpen(false);
      toast("Connection removed successfully", true);
    },
  });

  const isBlocking = handleBlockMutation.isPending;
  const isBlockingError = handleBlockMutation.isError;
  const isDeleting = handleDeleteMutation.isPending;
  const isDeletingError = handleDeleteMutation.isError;

  return (
    <ConnectionsCard
      connection={connection}
      navigateTo={navigateTo}
      isMyProfile={isMyProfile}
      blockModalOpen={blockModalOpen}
      setBlockModalOpen={setBlockModalOpen}
      removeConnectionModalOpen={removeConnectionModalOpen}
      setRemoveConnectionModalOpen={setRemoveConnectionModalOpen}
      onRemove={handleRemoveConnection}
      onBlock={handleBlock}
      isBlocking={isBlocking}
      isBlockingError={isBlockingError}
      isRemoving={isDeleting}
      isRemovingError={isDeletingError}
    />
  );
};
