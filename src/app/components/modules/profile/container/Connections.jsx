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

export default function Connections({ userInfo }) {
  const observerTarget = useRef(null);
  const router = useRouter();
  const { isMyProfile } = useIsMyProfile();

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

  const navigateTo = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const connections = data?.pages.flatMap((page) => page) || [];

  const formatConnectedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return "Connected today";
    } else if (diffDays < 7) {
      return `Connected ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
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

  const allConnections = [...connections].map((connection) => ({
    ...connection,
    connectedAt: formatConnectedDate(connection?.connectedAt),
    relation: changeRelation(connection?.connectionDegree),
  }));


  return (
    <Dialog
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

export const ConnectionsCardContainer = ({
  connection,
  navigateTo,
  isMyProfile,
}) => {
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [removeConnectionModalOpen, setRemoveConnectionModalOpen] =
    useState(false);
  const queryClient = useQueryClient();

  const handleBlock = () => {
    handleBlockMutation.mutate(connection?.username);
  };

  const handleRemoveConnection = () => {
    handleDeleteMutation.mutate(connection?.username);
  };

  const handleBlockMutation = useMutation({
    mutationFn: (username) => blockUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile"]);
      setBlockModalOpen(false);
    },
  });

  const handleDeleteMutation = useMutation({
    mutationFn: (username) => removeConnection(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile"]);
      setRemoveConnectionModalOpen(false);
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
