"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectUser } from "@/app/services/connectionManagement";
import PersonCardPresentation from "../presentation/PersonCardPresentation";
import { useState, useEffect } from "react";
/**
 * @namespace search
 * @module search
 *
 * @description
 * The `PersonCardContainer` component serves as a container for the `PersonCardPresentation` component.
 * It handles user interactions such as navigating to a user's profile or connecting with a user.
 * It also manages the connection state and triggers mutations using React Query.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.username - The username of the person displayed on the card.
 * @param {string} props.name - The full name of the person displayed on the card.
 * @param {string} props.headline - The headline or title of the person displayed on the card.
 * @param {string} props.location - The location of the person displayed on the card.
 * @param {string} props.avatarUrl - The URL of the avatar image for the person.
 * @param {boolean} [props.isConnected=false] - Indicates whether the current user is connected with the person.
 *
 * @returns {JSX.Element} The rendered `PersonCardPresentation` component with the provided props and event handlers.
 */

function PersonCardContainer({
  username,
  name,
  headline,
  location,
  avatarUrl,
  isConnected,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState(isConnected);
  
  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected]);

  const connectMutation = useMutation({
    mutationFn: () => connectUser(username),
    onMutate: async () => {
      setConnectionStatus("pending");
    },
    onError: () => {
      setConnectionStatus(isConnected);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["searchUsers"]);
    },
  });

  const handleNavigateToProfile = () => {
    router.push(`/u/${username}`);
  };

  const handleConnectClick = () => {
    if (connectionStatus == "rejected") {
      connectMutation.mutate();
    } else if (connectionStatus == "accepted") {
      router.push(`/messages?username=${username}`);
    } else if (connectionStatus == "pending") {
      router.push(`/network/pending`);
    }
  };

  return (
    <PersonCardPresentation
      username={username}
      name={name}
      headline={headline}
      location={location}
      avatarUrl={avatarUrl}
      isConnected={connectionStatus}
      onNavigateToProfile={handleNavigateToProfile}
      onConnectClick={handleConnectClick}
    />
  );
}

export default PersonCardContainer;
