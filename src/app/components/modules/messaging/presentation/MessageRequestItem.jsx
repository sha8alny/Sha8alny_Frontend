import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { formatDistanceToNow } from "@/app/utils/messagingUtils";
import { CheckCircle, XCircle, Trash2, MessageCircle } from "lucide-react";

export function MessageRequestItem({
  request,
  type = "received",
  onAccept,
  onReject,
  onDelete,
  onViewProfile,
  isProcessing = false,
}) {
  // Determine participant details based on request type
  const participant = type === "received" ? request.sender : request.receiver;
  const displayName = participant?.name || participant?.username || "Unknown User";
  const avatarFallback = (displayName.substring(0, 2) || "??").toUpperCase();
  
  // Format the timestamp
  const timestamp = request?.timestamp
    ? formatDistanceToNow(request.timestamp)
    : "";
  
  // Determine message preview
  const messagePreview = request?.message || 
    (type === "received" ? "Wants to start a conversation with you" : "You requested to start a conversation");
    
  // Determine status label
  let statusLabel = "";
  if (request.status === "pending") {
    statusLabel = "Pending";
  } else if (request.status === "accepted") {
    statusLabel = "Accepted";
  } else if (request.status === "rejected") {
    statusLabel = "Rejected";
  }
  
  return (
    <div className="flex items-start gap-3 p-3 mx-2 my-1 rounded-lg hover:bg-foreground/30 transition-colors duration-200">
      <Avatar className="flex-shrink-0" onClick={() => onViewProfile?.(participant)}>
        <AvatarImage
          src={participant?.profilePicture || `/placeholder.svg`}
          alt={displayName}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between w-full">
          <div className="font-medium truncate max-w-[60%] text-text">
            {displayName}
            {statusLabel && (
              <span className={`ml-2 text-xs ${
                request.status === "accepted" ? "text-green-500" : 
                request.status === "rejected" ? "text-red-500" : 
                "text-muted-foreground"
              }`}>
                ({statusLabel})
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
            {timestamp}
          </div>
        </div>

        <div className="text-sm text-muted-foreground truncate pr-2 mt-1">
          {messagePreview}
        </div>
        
        {/* Action buttons */}
        {request.status === "pending" && type === "received" && (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200"
              onClick={() => onAccept(request.id)}
              disabled={isProcessing}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200"
              onClick={() => onReject(request.id)}
              disabled={isProcessing}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
        
        {/* View conversation button for accepted requests */}
        {request.status === "accepted" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            onClick={() => onViewProfile?.(participant)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            View Conversation
          </Button>
        )}
        
        {/* Delete button for rejected or processed requests */}
        {(request.status === "rejected" || (request.status === "pending" && type === "sent")) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 bg-gray-200/10 hover:bg-gray-200/20"
            onClick={() => onDelete(request.id)}
            disabled={isProcessing}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
