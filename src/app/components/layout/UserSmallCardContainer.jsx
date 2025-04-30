"use client";
import {
  connectUser,
  handleConnectionRequest,
} from "@/app/services/connectionManagement";
import UserSmallCard from "./UserSmallCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserSmallCardContainer({ userInfo, onClick }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState(
    userInfo?.connectionStatus || "notConnected"
  );

  const handleConnectMutate = useMutation({
    mutationFn: (username) => connectUser(username),
    onSuccess: () => {
      setConnectionStatus("pending");
    },
  });

  const handleConnectionRequestMutate = useMutation({
    mutationFn: (action) => handleConnectionRequest(userInfo?.username, action),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile", userInfo?.username]);
      if (action === "ACCEPT") {
        setConnectionStatus("connected");
      } else if (action === "DECLINE") {
        setConnectionStatus("notConnected");
      }
    },
  });

  const handleClick = (action = "DECLINE") => {
    switch (userInfo?.connectionStatus) {
      case "connected":
        router.push(`/messages?username=${userInfo?.username}`);
        break;
      case "notConnected":
        handleConnectMutate.mutate(userInfo?.username);
        break;
      case "requestReceived":
        handleConnectionRequestMutate.mutate(action);
        break;
      case "pending":
        break;
    }
  };
  return (
    <UserSmallCard
      userInfo={{ ...userInfo, connectionStatus: connectionStatus }}
      onClick={onClick}
      isConnecting={handleConnectMutate.isPending}
      isHandlingRequest={handleConnectionRequestMutate.isPending}
      onButtonClick={handleClick}
    />
  );
}
