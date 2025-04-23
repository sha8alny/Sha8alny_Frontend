"use client"


import { MessagingContainer } from "../components/modules/messaging/container/MessagingInterfaceContainer"
import { useQuery } from '@tanstack/react-query';
import { fetchUsername } from "../services/userProfile";




export default function MessagesPage() {
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["username"],
    queryFn: fetchUsername,
  });
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (

      <MessagingContainer currentUser={data.username} />

  );
}
