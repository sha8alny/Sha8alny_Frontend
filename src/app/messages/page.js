"use client"

import { MessagingContainer } from "../components/modules/messaging/container/MessagingInterfaceContainer"
import { useQuery } from '@tanstack/react-query';
import { fetchUsername } from "../services/userProfile";
import { Suspense } from "react";




export default function MessagesPage() {
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["username"],
    queryFn: fetchUsername,
  });
  

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading messages...</div>;
  if (error) return <div className="text-red-500 p-4 flex justify-center items-center min-h-screen">Error loading messages: {error.message}</div>;
  if (!data) return <div className="text-amber-500 p-4 flex justify-center items-center min-h-screen">No data available</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagingContainer currentUser={data.username} />
    </Suspense>
  );
}
