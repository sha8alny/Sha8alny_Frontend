import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { MessageRequestItem } from "./MessageRequestItem";
import { ArrowLeft, InboxIcon, Send } from "lucide-react";

export function MessageRequestsPresentation({
  receivedRequests = [],
  sentRequests = [],
  selectedTab = "received",
  onTabChange,
  onAcceptRequest,
  onRejectRequest,
  onDeleteRequest,
  onViewProfile,
  onBack,
  loadingReceived,
  loadingSent,
  isProcessing,
}) {
  // Ensure receivedRequests is an array
  const safeReceivedRequests = Array.isArray(receivedRequests) ? receivedRequests : [];
  const safeSentRequests = Array.isArray(sentRequests) ? sentRequests : [];
  
  // Count pending received requests
  const pendingCount = safeReceivedRequests.filter(
    req => req.status === "pending"
  ).length;
  
  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-40 p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">Loading requests...</p>
    </div>
  );
  
  // Render empty state
  const renderEmpty = (type) => (
    <div className="flex flex-col items-center justify-center h-40 p-4">
      {type === "received" ? (
        <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
      ) : (
        <Send className="h-12 w-12 text-muted-foreground/50" />
      )}
      <p className="mt-4 text-muted-foreground">
        {type === "received" 
          ? "No message requests received" 
          : "You haven't sent any message requests"}
      </p>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 p-3 border-b bg-background/95 backdrop-blur-sm flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 h-8 w-8 hover:bg-foreground dark:hover:bg-foreground/80 transition-colors"
          data-testid="message-requests-back-button"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Button>
        <h2 className="text-lg font-medium flex-1 text-center pr-5 text-text">Message Requests</h2>
      </div>
      
      <Tabs value={selectedTab} onValueChange={onTabChange} className="flex-1 flex flex-col items-center w-full">
        <TabsList className="grid grid-cols-2 mx-3 mt-2 ">
          <TabsTrigger value="received" className="flex gap-2">
            Received
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="flex-1 mt-2">
          <ScrollArea className="h-full">
            {loadingReceived ? (
              renderLoading()
            ) : safeReceivedRequests.length === 0 ? (
              renderEmpty("received")
            ) : (
              <div className="py-2">
                {safeReceivedRequests.map((request) => (
                  <MessageRequestItem
                    key={request._id}
                    request={request}
                    type="received"
                    onAccept={onAcceptRequest}
                    onReject={onRejectRequest}
                    onDelete={onDeleteRequest}
                    onViewProfile={onViewProfile}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="sent" className="flex-1 mt-2">
          <ScrollArea className="h-full">
            {loadingSent ? (
              renderLoading()
            ) : safeSentRequests.length === 0 ? (
              renderEmpty("sent")
            ) : (
              <div className="py-2">
                {safeSentRequests.map((request) => (
                  <MessageRequestItem
                    key={request._id}
                    request={request}
                    type="sent"
                    onDelete={onDeleteRequest}
                    onViewProfile={onViewProfile}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
