import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { formatDistanceToNow } from "@/app/utils/messagingUtils";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

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
  const participant =
    type === "received" ? request.senderId : request.receiverId;
  const displayName =
    participant?.name || participant?.username || "Unknown User";
  const avatarFallback = (displayName.substring(0, 2) || "??").toUpperCase();

  // Format the timestamp
  const timestamp = request?.createdAt
    ? formatDistanceToNow(request.createdAt)
    : "";

  // Determine message preview
  const messagePreview =
    request?.message ||
    (type === "received"
      ? "Wants to start a conversation with you"
      : "You requested to start a conversation");

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
    <div className="flex items-start gap-4 w-full p-4 mx-0 my-1 rounded-lg hover:bg-foreground/30 transition-colors duration-200">
      <Avatar
        className="h-10 w-10 flex-shrink-0 cursor-pointer"
        onClick={() => onViewProfile?.(participant)}
        data-testid="avatar-view-profile"
      >
        <AvatarImage
          src={participant?.profilePicture || `/placeholder.svg`}
          alt={displayName}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between w-full mb-1">
          <h4 className="font-medium truncate text-text">{displayName}</h4>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
            {timestamp}
          </div>
        </div>

        {statusLabel && (
          <div
            className={`text-xs mb-1 ${
              request.status === "accepted"
                ? "text-green-500"
                : request.status === "rejected"
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {statusLabel}
          </div>
        )}

        <div className="text-sm text-muted-foreground truncate pr-2">
          {messagePreview}
        </div>

        {/* Action buttons */}
        {request.status === "pending" && type === "received" && (
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200"
              onClick={() => onAccept(request._id)}
              disabled={isProcessing}
              data-testid="button-accept"
            >
              <CheckCircleOutlineIcon className="mr-1" sx={{ fontSize: 16 }} />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200"
              onClick={() => onReject(request._id)}
              disabled={isProcessing}
              data-testid="button-decline"
            >
              <CancelOutlinedIcon className="mr-1" sx={{ fontSize: 16 }} />
              Decline
            </Button>
          </div>
        )}

        {/* View conversation button for accepted requests */}
        {request.status === "accepted" && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            onClick={() => onViewProfile?.(participant)}
            data-testid="button-view-conversation"
          >
            <ChatBubbleOutlineIcon className="mr-1" sx={{ fontSize: 16 }} />
            View Conversation
          </Button>
        )}

        {/* Delete button for rejected or processed requests */}
        {(request.status === "rejected" ||
          (request.status === "pending" && type === "sent")) && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-gray-200/10 hover:bg-gray-200/20"
            onClick={() => onDelete(request._id)}
            disabled={isProcessing}
            data-testid="button-remove"
          >
            <DeleteOutlineIcon className="mr-1" sx={{ fontSize: 16 }} />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
