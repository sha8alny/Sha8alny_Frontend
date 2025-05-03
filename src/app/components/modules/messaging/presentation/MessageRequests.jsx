import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { MessageRequestItem } from "./MessageRequestItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
/**
 * @namespace messages
 * @module messages
 */
/**
 * MessageRequestsPresentation
 *
 * Displays tabs for received and sent message requests, with loading and empty states.
 *
 * @param {Object} props
 * @param {Array} [props.receivedRequests=[]] - Array of received message requests.
 * @param {Array} [props.sentRequests=[]] - Array of sent message requests.
 * @param {string} [props.selectedTab="received"] - Currently selected tab ("received" or "sent").
 * @param {function} props.onTabChange - Handler for changing the selected tab.
 * @param {function} props.onAcceptRequest - Handler for accepting a received request.
 * @param {function} props.onRejectRequest - Handler for rejecting a received request.
 * @param {function} props.onDeleteRequest - Handler for deleting a request.
 * @param {function} props.onViewProfile - Handler for viewing a participant's profile.
 * @param {function} props.onBack - Handler for navigating back.
 * @param {boolean} props.loadingReceived - Loading state for received requests.
 * @param {boolean} props.loadingSent - Loading state for sent requests.
 * @param {boolean} props.isProcessing - Whether an action is currently processing.
 */
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
  const safeReceivedRequests = Array.isArray(receivedRequests)
    ? receivedRequests
    : [];
  const safeSentRequests = Array.isArray(sentRequests) ? sentRequests : [];

  // Count pending received requests
  const pendingCount = safeReceivedRequests.filter(
    (req) => req.status === "pending"
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
        <InboxIcon
          className="h-12 w-12 text-muted-foreground/50"
          sx={{ height: "3rem", width: "3rem" }}
        />
      ) : (
        <SendIcon
          className="text-muted-foreground/50"
          sx={{ height: "3rem", width: "3rem" }}
        />
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
          <ArrowBackIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <h2 className="text-lg font-medium flex-1 text-center pr-5 text-text">
          Message Requests
        </h2>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={onTabChange}
        className="flex-1 flex flex-col items-center w-full"
      >
        <TabsList className="grid grid-cols-2 mx-3 mt-2 ">
          <TabsTrigger
            value="received"
            className="flex gap-2"
            data-testid="tabs-trigger-received"
          >
            Received
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" data-testid="tabs-trigger-sent">
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="received"
          className="flex-1 w-full mt-2 overflow-hidden"
        >
          <ScrollArea className="h-full w-full pr-1">
            {loadingReceived ? (
              renderLoading()
            ) : safeReceivedRequests.length === 0 ? (
              renderEmpty("received")
            ) : (
              <div className="flex flex-col gap-1 px-2">
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

        <TabsContent
          value="sent"
          className="flex-1 w-full mt-2 overflow-hidden"
        >
          <ScrollArea className="h-full w-full pr-1">
            {loadingSent ? (
              renderLoading()
            ) : safeSentRequests.length === 0 ? (
              renderEmpty("sent")
            ) : (
              <div className="flex flex-col gap-1 px-2">
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
export default MessageRequestsPresentation;
