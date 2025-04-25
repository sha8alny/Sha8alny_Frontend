export default function UserSmallCardContainer({ userInfo, navigateTo }) {
  const handleConnectMutate = useMutation({
    mutationFn: (username) => connectUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile", userInfo?.username]);
    },
  });

  const handleConnectionRequestMutate = useMutation({
    mutationFn: (action) => handleConnectionRequest(userInfo?.username, action),
    onSuccess: () => {
      queryClient.invalidateQueries(["connections"]);
      queryClient.invalidateQueries(["userProfile", userInfo?.username]);
    },
  });

  const handleClick = (action = "DECLINE") => {
    switch (userInfo?.connectionStatus) {
      case "connected":
        router.push(`/u/${userInfo?.username}`); // TODO: Go to chat
        break;
      case "notConnected":
        handleConnectMutate.mutate(userInfo?.username);
        break;
      case "requestReceived":
        handleConnectionRequestMutate.mutate(action);
        break;
      case "pending":
        toast("You have already sent a connection request");
        break;
    }
  };

  const isConnecting = handleConnectMutate.isPending;
  const isHandlingRequest = handleConnectionRequestMutate.isPending;
}
