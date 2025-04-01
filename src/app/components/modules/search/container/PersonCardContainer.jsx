"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonCardPresentation } from "../presentation/PersonCardPresentation";

 function PersonCardContainer({
  username,
  name,
  headline,
  location,
  avatarUrl = "/placeholder.svg?height=40&width=40",
  isConnected = false,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const connectWithUser = () => null; // Replace with actual API call

  const connectMutation = useMutation({
    mutationFn: () => connectWithUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["searchUsers"]);
    },
  });

  const handleNavigateToProfile = () => {
    router.push(`/u/${username}`);
  };

  const handleConnectClick = () => {
    if (!isConnected) {
      connectMutation.mutate();
    } else {
      router.push(`/messages/${username}`);
    }
  };

  return (
    <PersonCardPresentation
      username={username}
      name={name}
      headline={headline}
      location={location}
      avatarUrl={avatarUrl}
      isConnected={isConnected}
      onNavigateToProfile={handleNavigateToProfile}
      onConnectClick={handleConnectClick}
    />
  );
}

export default PersonCardContainer;